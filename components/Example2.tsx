"use client"

import { getLivekitToken } from '@/lib/actions/token.action';
import { useIsSpeaking, useMaybeParticipantContext, useParticipantContext, useTrackRefContext } from '@livekit/components-react';
import {
    GridLayout,
    ParticipantTile,
    VideoTrack,
    TrackMutedIndicator,
    LiveKitRoom,
    RoomAudioRenderer,
    useTracks
} from '@livekit/components-react';
import { use, useEffect, useState } from 'react';
import '@livekit/components-styles';
import { Track } from 'livekit-client';
import { MeetControlBar } from './MeetControlBar';
import { cn } from '@/lib/utils';

export default function Example2({ participantName, roomName }: { participantName: string, roomName: string }) {
    const [error, setError] = useState<string | null>(null)
    const [credentials, setCredentials] = useState<{ token: string | null, ws_url?: string | null }>({
        token: null,
        ws_url: null
    })

    useEffect(() => {
        if (!participantName || !roomName) {
            setError('Missing participantName or roomName')
            return
        }

        const fetchToken = async () => {
            try {
                const res = await getLivekitToken({
                    participant_name: participantName,
                    room_name: roomName
                })
                if (res.error) {
                    setError(res.error)
                    return
                }

                setCredentials({
                    token: res.token ?? null,
                    ws_url: res.ws_url ?? null
                })
            } catch (e: unknown) {
                setError((e as Error)?.message ?? 'Unknown error')
            }
        }
        fetchToken()
    }, [participantName, roomName])

    if (error) return <div>
        <h1>Something went wrong</h1>
        <p>{error}</p>
    </div>

    return (
        <LiveKitRoom
            token={credentials.token ?? undefined}
            serverUrl={credentials.ws_url ?? undefined}
            connect={true}
            data-lk-theme="default"
            style={{ height: '100vh' }}
        >
            <MyVideoGrid />
            <MeetControlBar />
            <RoomAudioRenderer />
        </LiveKitRoom>
    );
}

function MyVideoGrid() {
    // Get everything: Cameras and Screen Shares
    const allTracks = useTracks([
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
    ]);

    // Find if anyone is sharing their screen
    const screenShareTrack = allTracks.find(t => t.source === Track.Source.ScreenShare);

    // Filter out the cameras for the sidebar
    const cameraTracks = allTracks.filter(t => t.source === Track.Source.Camera);

    if (screenShareTrack) {
        return (
            <div className="flex h-[calc(100vh-100px)] w-full gap-4 p-4">
                {/* BIG SCREEN: Takes up most of the space */}
                <div className="flex-3 relative bg-black rounded-2xl overflow-hidden">
                    <CustomMeetTile trackRef={screenShareTrack} />
                </div>

                {/* SIDEBAR: People's cameras in a column */}
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                    {cameraTracks.map((track) => (
                        <div key={track.publication?.trackSid} className="h-40">
                            <CustomMeetTile trackRef={track} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // DEFAULT: If no one is sharing, show the standard grid
    return (
        <GridLayout tracks={allTracks}>
            <CustomMeetTile />
        </GridLayout>
    );
}

export function CustomMeetTile({ trackRef }: { trackRef?: any }) {
    const isSpeaking = useIsSpeaking(trackRef?.participant);

    return (
        <ParticipantTile
            trackRef={trackRef}
            className={cn(
                "relative h-full w-full rounded-xl overflow-hidden bg-slate-900 border-2 transition-all",
                isSpeaking ? "border-blue-500 ring-2 ring-blue-500/20" : "border-transparent"
            )}
        >
            <VideoTrack trackRef={trackRef} />
            <TileFooter />
            {/* <SpeakingBorder participant={trackRef?.participant} /> */}
        </ParticipantTile>
    );
}

function TileFooter() {
    const trackRef = useTrackRefContext();
    const participant = useParticipantContext();

    if (!trackRef || !participant) return null;

    return (
        <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/60 px-2 py-1 rounded text-white text-xs backdrop-blur-md">
            <span>{participant.identity}</span>
            <TrackMutedIndicator trackRef={trackRef} />
        </div>
    );
}

function SpeakingBorder({ participant }: { participant?: any }) {
    const isSpeaking = useIsSpeaking(participant);

    return (
        <div className={cn(
            "absolute inset-0 z-10 pointer-events-none rounded-xl border",
            isSpeaking ? "border-blue-500" : "border-transparent"
        )} />
    );
}