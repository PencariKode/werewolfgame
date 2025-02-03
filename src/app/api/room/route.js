import dbConnect from "@l/mgdb";
import Room from "@l/models/Room";
import { NextResponse } from "next/server";
import { validateApikey, invalidApikey } from "@/app/api/util";

export async function GET(req) {
    if (!validateApikey(req)) return invalidApikey();

    try {
        await dbConnect();
    
        const url = new URL(req.url);
        const code = url.searchParams.get('code');

        if (code) {
            const room = await Room.findOne({ roomCode: code });
            if (!room) {
                return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: room, size: 1 }, { status: 200 });
        }

        const rooms = await Room.find({});
        return NextResponse.json({ success: true, data: rooms, size: rooms.length }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: error.toString().split(":")[1].trim() }, { status: 400 });
    }

}