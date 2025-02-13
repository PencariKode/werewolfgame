'use server';

import { publishMessage } from "@/app/api/sse/lobby/route";
import dbConnect from "@l/mgdb";
import Room from "@l/models/Room";
import { kv } from "@vercel/kv";


export async function getRoom(code) {
    try {
        await dbConnect();

        const room = await Room.findOne({ roomCode: code }).lean();

        if (!room) {
            return {
                success: false,
                message: 'Room not found'
            }
        }

        const serializedRoom = {
            ...room,
            _id: room._id.toString(),
        };

        return {
            success: true,
            data: serializedRoom
        }

    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: err.message
        }
    }
}

export async function deleteRoom(_, code) {
    try {
        await dbConnect();

        // const room = await Room.findOneAndDelete({ roomCode: code });
        const findRoom = await Room.findOne({ roomCode: code });
        if (!findRoom) {
            return {
                success: false,
                message: 'Room not found'
            }
        }

        const room = await Room.findOneAndDelete({ roomCode: code });

        await kv.del(`game:${code}`);

        await publishMessage(`game:${code}:updates`, 'delete@nodata');

        return {
            success: true,
            data: "success"
        }

    } catch (err) {
        console.log(err);
        return {
            success: false,
            message: err.message
        }
    }
}

export async function leaveRoom(_, {roomCode, user, fullname}) {
    try {
        await dbConnect();

        const room = await Room.findOne({ roomCode });
        if (!room) {
            return {
                success: false,
                error: 'Room not found'
            }
        }

        const userExist = room.lobbyJoined.find(lobby => lobby === user);
        if (!userExist) {
            return {
                success: false,
                error: 'User not joined'
            }
        }

        room.lobbyJoined = room.lobbyJoined.filter(item => item !== undefined && item !== null && item !== user);

        await room.save();

        let updatedPlayers = await kv.hget(`game:${roomCode}`, "players");
        updatedPlayers = updatedPlayers.filter(item => item.id !== user);

        await kv.hset(`game:${roomCode}`, {
            players: updatedPlayers
        });

        await publishMessage(`game:${roomCode}:updates`, `leave@${user}|${fullname}`);

        return {
            success: true,
            error: ''
        }


    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: error.message
        }
    }

    
}