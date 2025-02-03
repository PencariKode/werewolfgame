import dbConnect from "@l/mgdb";
import Room from "@l/models/Room";
import { NextResponse } from 'next/server';
import { validateApikey, invalidApikey } from "@/app/api/util";

export async function GET(req) {
    if (!validateApikey(req)) return invalidApikey();
    await dbConnect();

    try {

        const room = await Room.find({});
        if (!room) {
            return NextResponse.json({ success: false, error: "Room not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: room, size: room.length }, { status: 200 });
    } catch (error) {
        console.log("ROOMERR", error);
        return NextResponse.json({ success: false, error: error.toString().split(":")[1].trim() }, { status: 400 });
    }
}

export async function DELETE(req) {
    if (!validateApikey(req)) return invalidApikey();
    await dbConnect();
    try {

        await Room.deleteMany({});
        return NextResponse.json({ success: true, message: "All rooms deleted" }, { status: 200 });
    } catch (error) {
        console.log("ROOMERR", error);
        return NextResponse.json({ success: false, error: error.toString().split(":")[1].trim() }, { status: 400 });
    }
}