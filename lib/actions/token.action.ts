"use server"

import { AccessToken } from "livekit-server-sdk";

export async function getLivekitToken({
    room_name,
    participant_name
}: {
    room_name: string,
    participant_name: string
}): Promise<{
    token?: string,
    error?: string,
    ws_url?: string
}> {
    // console.log({ room_name, participant_name })

    if (!room_name || !participant_name) {
        return { error: 'Missing room_name or participant_name' };
    }

    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET
    const livekitUrl = process.env.LIVEKIT_URL

    if (!apiKey || !apiSecret) {
        return { error: 'Missing LIVEKIT_API_KEY or LIVEKIT_API_SECRET' }
    }

    const at = new AccessToken(apiKey, apiSecret, { identity: participant_name })

    // `addGrant` expects a specific grant shape from the SDK; cast to any to satisfy TS if types differ.
    at.addGrant({
        roomJoin: true,
        room: room_name,
        canPublish: true,
        canSubscribe: true
    } as any)

    const token = await at.toJwt()

    // console.log('Returning:', { participant_token: token, server_url: livekitUrl })

    return { token, ws_url: livekitUrl ?? undefined }
}