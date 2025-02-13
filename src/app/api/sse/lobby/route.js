import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import axios from 'axios';

const kvRestUrl = process.env.KV_REST_API_URL;
const kvRestToken = process.env.KV_REST_API_TOKEN;


/**
 * 
 * @param {NextRequest} request 
 * @returns {NextResponse}
 */
export async function GET(request) {
    const roomCode = request.nextUrl.searchParams.get('roomCode');

    return new NextResponse(
        new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                // Kirim data awal
                const initialData = await kv.hgetall(`game:${roomCode}`);
                if (initialData) {
                    if (initialData.players) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ ...initialData, type: "init" })}\n\n`));
                    }
                }

                // Subscribe ke channel Redis
                const channel = `game:${roomCode}:updates`;
                const subscriber = await subscribeToChannel(channel);
                subscriber.on('data', (chunk) => {
                    const data = chunk.toString().trim();
                    if (data) {
                        console.log('Received message:', data);
                        // controller.enqueue(encoder.encode('data: {"message": "Connected"}\n\n'));
                        let [type, channelName, message] = data.split(",");
                        type = (type.split(" ")[1]).trim();


                        switch (type) {
                            case 'subscribe':
                                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'subscribe', channel: channelName, status: parseInt(message), message: 'Connected' })}\n\n`))
                                break;

                            case 'message':
                                const [category, rawData] = message.split('@');

                                switch (category) {
                                    case 'join':
                                        const data = {
                                            id: rawData.split('|')[0],
                                            fullname: rawData.split('|')[1]
                                        }
                                        const ent = `data: ${JSON.stringify({ type: 'join', channel: channelName, message: data })}\n\n`
                                        controller.enqueue(encoder.encode(ent));
                                        break;
                                    
                                    case 'leave':
                                        // console.log("LEAVE", rawData);
                                        const dataLeave = {
                                            id: rawData.split('|')[0],
                                            fullname: rawData.split('|')[1]
                                        }
                                        const entLeave = `data: ${JSON.stringify({ type: 'leave', channel: channelName, message: dataLeave })}\n\n`
                                        controller.enqueue(encoder.encode(entLeave));
                                        break;

                                    case 'delete':
                                        const mess = "Room deleted";
                                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'delete', channel: channelName, message: mess })}\n\n`));
                                        break;
                                        
                                }


                                break;

                            default:
                                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', channel: channelName, message })}`));
                        }

                    }
                });

                // Handle client disconnect
                request.signal.onabort = () => {
                    subscriber.destroy();
                    controller.close();
                };
            },
        }),
        {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        }
    );
}



export async function subscribeToChannel(channel) {
    try {
        const url = `${kvRestUrl}/subscribe/${channel}`;
        const headers = {
            Authorization: `Bearer ${kvRestToken}`,
            Accept: 'text/event-stream',
        };

        const response = await axios({
            method: 'post',
            url,
            headers,
            responseType: 'stream',
        });

        // response.data.on('data', (chunk) => {
        //     const data = chunk.toString().trim();
        //     if (data) {
        //         console.log('Received message:', data);
        //     }
        // });

        response.data.on('end', () => {
            console.log('Subscription ended.');
        });

        return response.data

    } catch (error) {
        console.error('Error subscribing to channel:', error);
    }
}


export async function publishMessage(channel, message) {
    try {
        const url = `${kvRestUrl}/publish/${channel}`;
        const headers = {
            Authorization: `Bearer ${kvRestToken}`,
        };
        const data = message;

        const response = await axios.post(url, data, { headers });
        console.log('Publish response:', response.data);
    } catch (error) {
        console.log('Error publishing message:', error);
    }
}
