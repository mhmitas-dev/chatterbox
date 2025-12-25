'use client';

import {
  SessionProvider,
  useSession,
  RoomAudioRenderer,
  RoomName,
  TrackLoop,
  TrackMutedIndicator,
  useIsMuted,
  useIsSpeaking,
  useTrackRefContext,
  useTracks,
} from '@livekit/components-react';
import { useLocalParticipant } from '@livekit/components-react';
import { Link, Mic, MicOff } from "lucide-react";
import { Track, TokenSource } from 'livekit-client';
import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { NextPage } from 'next';

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const Clubhouse: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Read initial values directly from URL (reactive!)
  const initialRoomName = searchParams?.get('roomName') ?? ''
  const initialParticipantName = searchParams?.get('participantName') ?? ''
  const target = searchParams?.get('target')

  const [roomName, setRoomName] = useState(initialRoomName)
  const [participantName, setParticipantName] = useState(initialParticipantName)
  const [tryToConnect, setTryToConnect] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Optional: react to URL changes after mount (e.g. browser back/forward or external link change)
  useEffect(() => {
    setRoomName(searchParams?.get('roomName') ?? '')
    setParticipantName(searchParams?.get('participantName') ?? '')
  }, [searchParams])

  // Cleaner URL update (shallow replace, no full navigation)
  const updateURLParams = useCallback(
    (newRoom: string, newName: string) => {
      const params = new URLSearchParams(searchParams?.toString() ?? '')
      if (newRoom) {
        params.set('roomName', newRoom)
      } else {
        params.delete('roomName')
      }
      if (newName) {
        params.set('participantName', newName)
      } else {
        params.delete('participantName')
      }

      // Preserve other params if needed (e.g. target)
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
      router.replace(newUrl, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  const tokenSource = TokenSource.endpoint("/api/token")
  const session = useSession(tokenSource, {
    roomName,
    participantIdentity: participantName,
    participantName: participantName,
  })

  useEffect(() => {
    if (tryToConnect && roomName && participantName) {
      setError(null)
      session.start({ tracks: { microphone: { enabled: true } } })
        .catch((err) => {
          setError("Disconnected")
          setTryToConnect(false)
        })
    } else if (!tryToConnect) {
      session.end().catch(() => { })
    }
  }, [tryToConnect, session, roomName, participantName])

  const handleJoin = () => {
    if (roomName && participantName) {
      updateURLParams(roomName, participantName)
      setTryToConnect(true)
    }
  }

  const copyInviteLink = () => {
    const baseUrl = window.location.origin + pathname
    const inviteUrl = `${baseUrl}?roomName=${encodeURIComponent(roomName)}`

    navigator.clipboard.writeText(inviteUrl)
    toast.success("Room link copied!", {
      description: `Invite your friends and have a party`,
    })
  }

  return (
    <div className="relative h-screen bg-background text-foreground overflow-hidden">
      <SessionProvider session={session}>

        {/* Lobby UI */}
        {!session.isConnected && (
          <div className="flex flex-col items-center justify-center h-full max-w-87.5 mx-auto gap-6 px-4">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Chatterbox</h1>
            </div>

            <div className="w-full space-y-4 border p-6 rounded-lg bg-card">
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="room">Room Name</Label>
                <Input id="room" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" value={participantName} onChange={(e) => setParticipantName(e.target.value)} />
              </div>
              <Button
                className="w-full"
                disabled={!roomName || !participantName || tryToConnect}
                onClick={handleJoin}
              >
                {tryToConnect ? "Connecting..." : "Join Room"}
              </Button>
              <p className='text-xs text-end'>By Mahfuzul</p>
            </div>
          </div>
        )}

        {/* Room UI */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 mx-auto w-full max-w-4xl h-[85vh] bg-card border-x border-t rounded-t-2xl shadow-2xl transition-transform duration-500 flex flex-col",
            session.isConnected ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="font-bold text-lg">
              Chatterbox
            </h2>
            <p className='text-xs italic text-muted-foreground'>By Mahfuzul</p>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold text-lg">
              <RoomName />
            </h2>
            <div className='flex items-center gap-3'>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={copyInviteLink}
              >
                <Link className="h-4 w-4" /> {/* Lucide icon */}
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={() => setTryToConnect(false)}>
                Leave
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex-1 overflow-y-auto p-8">
            <Stage />
          </div>

          <div className="p-6  border-t flex justify-center">
            <MicToggle />
          </div>
          <RoomAudioRenderer />
        </div>
      </SessionProvider>
    </div>
  );
};

const Stage = () => {
  const tracksReferences = useTracks([Track.Source.Microphone]);
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-y-10 gap-x-4 justify-items-center">
      <TrackLoop tracks={tracksReferences}>
        <CustomParticipantTile />
      </TrackLoop>
    </div>
  );
};

const CustomParticipantTile = () => {
  const trackRef = useTrackRefContext();
  const isSpeaking = useIsSpeaking(trackRef.participant);
  const isMuted = useIsMuted(trackRef);
  const id = trackRef.participant.identity;

  return (
    <section className="relative flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar
          className={cn(
            "h-16 w-16 md:h-20 md:w-20 ring-offset-background transition-all",
            isSpeaking ? "ring-2 ring-offset-2 ring-blue-500" : "ring-0"
          )}
        >
          <AvatarImage src={`https://api.dicebear.com/9.x/fun-emoji/svg?seed=${id}`} />
          <AvatarFallback className="bg-secondary text-xs uppercase">{id.substring(0, 2)}</AvatarFallback>
        </Avatar>
        {isMuted && (
          <div className="absolute -bottom-1 -right-1 bg-background border rounded-full p-1">
            <TrackMutedIndicator className="w-3.5 h-3.5" trackRef={trackRef} />
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-center truncate w-20">{id}</span>
    </section>
  );
};

export default Clubhouse;


const MicToggle = () => {
  const { localParticipant } = useLocalParticipant();
  const isMuted = !localParticipant.isMicrophoneEnabled;

  const toggleMic = async () => {
    await localParticipant.setMicrophoneEnabled(isMuted);
  };

  return (
    <Button
      variant={isMuted ? "destructive" : "secondary"}
      size="icon"
      className="rounded-full h-12 w-12 shadow-md"
      onClick={toggleMic}
    >
      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
    </Button>
  );
};
