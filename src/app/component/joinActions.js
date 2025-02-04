'use server'
import dbConnect from "@l/mgdb"
import Room from "@l/models/Room"


export async function joinRoom(_, {roomCode, user}) {
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

        console.log("ROOM", room);

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