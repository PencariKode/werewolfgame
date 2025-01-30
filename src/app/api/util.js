import { NextResponse } from 'next/server';

/**
 * Validating API key
 * @param {NextRequest} req - Incoming request
 * @returns boolean
 */
export function validateApikey(req) {
    const url = new URL(req.url);
    let apiKey = url.searchParams.get('apikey');
    if (!apiKey) {
        apiKey = req.headers.get('x-api-key');
    }
    if (!apiKey) return false;
    return apiKey === process.env.NEXT_PUBLIC_WEB_APIKEY;
}

/** Sending Response for invalid API key
 * @returns NextResponse
 */
export function invalidApikey() {
    return NextResponse.json({ success: false, error: 'Invalid API key' }, { status: 401 });
}