import { AccessToken } from 'livekit-server-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { room_name, participant_name } = body; // ← Use underscores!

    // console.log({ room_name, participant_name })

    if (!room_name || !participant_name) {
        return NextResponse.json({ error: 'Missing room_name or participant_name' }, { status: 400 });
    }

    const at = new AccessToken(
        process.env.LIVEKIT_API_KEY,
        process.env.LIVEKIT_API_SECRET,
        { identity: participant_name }
    );

    at.addGrant({
        roomJoin: true,
        room: room_name,
        canPublish: true,
        canSubscribe: true
    });

    const token = await at.toJwt();

    const response = {
        participant_token: token,
        server_url: process.env.LIVEKIT_URL
    };
    // console.log('Returning:', response);

    return NextResponse.json(response);
}