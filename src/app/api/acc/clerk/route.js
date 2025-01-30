import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { validateApikey, invalidApikey } from "@/app/api/util";

export async function GET(req) {
    if (!validateApikey(req)) return invalidApikey();
    try {
        // Get the authenticated user
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}