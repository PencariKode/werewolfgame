'use server';

import dbConnect from "@l/mgdb";
import Room from "@l/models/Room";


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