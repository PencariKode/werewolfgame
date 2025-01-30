import dbConnect from "@l/mgdb";
import User from "@l/models/User";
import { NextResponse } from 'next/server';
import { validateApikey, invalidApikey } from "@/app/api/util";

const reqKeys = ["clerkId", "name", "email", "role", "imageUrl"];

export async function GET(req) {
    if (!validateApikey(req)) return invalidApikey();
    
    await dbConnect();

    try {
        const url = new URL(req.url);
        const clerkId = url.searchParams.get('clerkId');
        
        if (clerkId) {
            const user = await User.findOne({ clerkId });
            if (!user) {
                return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: user, size: 1 }, { status: 200 });
        }

        const users = await User.find({});
        return NextResponse.json({ success: true, data: users, size: users.length }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.toString().split(":")[1].trim() }, { status: 400 });
    }
}

export async function POST(req) {
    if (!validateApikey(req)) return invalidApikey();

    await dbConnect();
    try {
        const body = await req.json();
        for (const key of reqKeys) {
            if (!(key in body)) {
                return NextResponse.json({ success: false, error: `Missing required field: '${key}'` }, { status: 400 });
            }
        }
        const user = new User(body);
        user.save();
        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.toString().split(":")[1].trim() }, { status: 400 });
    }
}

export async function PUT(req) {
    if (!validateApikey(req)) return invalidApikey();

    await dbConnect();

    try {
        const body = await req.json();
        if (!body.id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }
        if (!body.data) {
            return NextResponse.json({ success: false, error: "Data is required" }, { status: 400 });
        }
        const existingUser = await User.findOne({ clerkId: body.id });
        if (!existingUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }
        const user = await User.findOneAndUpdate({ clerkId: body.id }, body.data, { new: true });
        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.toString().split(":")[1].trim() }, { status: 400 });
    }
}


export async function DELETE(req) {
    if (!validateApikey(req)) return invalidApikey();

    await dbConnect();

    try {
        const body = await req.json();
        if (!body.id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }
        if (!body.data) {
            return NextResponse.json({ success: false, error: "Data is required" }, { status: 400 });
        }
        const existingUser = await User.findOne({ clerkId: body.id });
        if (!existingUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }
        const user = await User.findByIdAndDelete(body.id);
        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.toString().split(":")[1].trim() }, { status: 400 });
    }
}

