import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function GET(request: NextRequest) {
    try {
        const roomName = request.nextUrl.searchParams.get('roomName');
        const participantName = request.nextUrl.searchParams.get('participantName');

        if (!roomName) {
            return NextResponse.json(
                { error: 'Missing roomName parameter' },
                { status: 400 }
            );
        }

        // Get LiveKit credentials from environment variables
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        const wsUrl = process.env.LIVEKIT_URL;

        if (!apiKey || !apiSecret || !wsUrl) {
            console.error('Missing LiveKit environment variables');
            return NextResponse.json(
                { error: 'Server configuration error. Please check LiveKit credentials.' },
                { status: 500 }
            );
        }

        // Create access token
        const at = new AccessToken(apiKey, apiSecret, {
            identity: participantName || `user-${Math.random().toString(36).substring(7)}`,
            ttl: '10m', // Token valid for 10 minutes
        });

        // Grant permissions
        at.addGrant({
            room: roomName,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true,
        });

        const token = await at.toJwt();

        return NextResponse.json({
            token,
            wsUrl,
            roomName,
        });
    } catch (error) {
        console.error('Error generating LiveKit token:', error);
        return NextResponse.json(
            { error: 'Failed to generate token' },
            { status: 500 }
        );
    }
}
