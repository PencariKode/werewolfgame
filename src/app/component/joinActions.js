'use server'
import dbConnect from "@l/mgdb"
import Room from "@l/models/Room"
// import { sendMessage } from "@/app/api/events/route";
import { publishMessage } from "@/app/api/sse/lobby/route";
import { kv } from "@vercel/kv";


export async function joinRoom(_, {roomCode, user, fullname}) {
    roomCode = roomCode.includes('-') ? roomCode.replace(/-/g, '') : roomCode;
    roomCode = roomCode.toLowerCase();


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
        if (userExist) {
            return {
                success: false,
                error: 'User already joined'
            }
        }

        room.lobbyJoined = room.lobbyJoined.filter(item => item !== undefined && item !== null);

        if (room.lobbyJoined.length >= room.jumlahPemain) {
            return {
                success: false,
                error: 'Room is full'
            }
        }

        room.lobbyJoined.push(user);

        await room.save();

        // console.log("ROOM", room);
        // sendMessage(JSON.stringify({ message: 'Room updated' }));

        const kvData = await kv.hget(`game:${roomCode}`, "players");
        if (!(kvData.find(item => item.id === user))) {
            kvData.push({fullname, id: user});
            await kv.hset(`game:${roomCode}`, {players: kvData});
        }

        const channel = `game:${roomCode}:updates`
        setTimeout(async () => {
            await publishMessage(channel, "join@"+user+'|'+fullname)
        }, 500)
        

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