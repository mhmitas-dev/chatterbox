import { useDisconnectButton } from "@livekit/components-react";
import { useTrackToggle } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { MonitorUp, MonitorOff } from "lucide-react";

export function MeetControlBar() {
    return (
        <div className="fixed bottom-0 left-0 right-0 p-6 flex items-center justify-center gap-4 bg-linear-to-t from-black/50 to-transparent">
            {/* Our Custom Buttons */}
            <MediaToggle source={Track.Source.Microphone} />
            <MediaToggle source={Track.Source.Camera} />
            <ScreenShareToggle />
            {/* Leave Button - Customizing a LiveKit standard brick with Tailwind */}
            <CustomLeaveButton />
        </div>
    );
}


interface MediaToggleProps {
    source: Track.Source.Microphone | Track.Source.Camera;
}
const MediaToggle = ({ source }: MediaToggleProps) => {
    const { toggle, enabled } = useTrackToggle({ source });

    const isMic = source === Track.Source.Microphone;

    return (
        <Button
            variant={enabled ? "outline" : "destructive"} // Shadcn variants
            size="icon"
            className={cn(
                "h-12 w-12 rounded-full transition-all duration-300 backdrop-blur-[2px]",
                enabled ? "bg-secondary text-secondary-foreground" : "bg-red-600 text-white"
            )}
            onClick={() => toggle()}
        >
            {isMic ? (
                enabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />
            ) : (
                enabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />
            )}
        </Button>
    )
}



export function ScreenShareToggle() {
    // We specify 'ScreenShare' as the source
    const { toggle, enabled } = useTrackToggle({
        source: Track.Source.ScreenShare
    });

    return (
        <Button
            variant={enabled ? "default" : "outline"}
            size="icon"
            className={cn(
                "h-12 w-12 rounded-full transition-all",
                enabled ? "bg-green-600 text-white hover:bg-green-700" : "bg-secondary"
            )}
            onClick={() => toggle()}
        >
            {enabled ? <MonitorOff className="h-5 w-5" /> : <MonitorUp className="h-5 w-5" />}
        </Button>
    );
}



export function CustomLeaveButton() {
    const { buttonProps } = useDisconnectButton({ stopTracks: true });

    return (
        <Button
            {...buttonProps}
            variant="destructive"
            className="rounded-full h-12 px-6"
        >
            Leave
        </Button>
    );
}