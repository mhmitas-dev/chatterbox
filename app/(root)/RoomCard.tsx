import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatShortDateTimeLocal } from "@/lib/utils";

export interface RoomCardProps {
    sid: string,
    name: string,
    creationTime: bigint,
    numParticipants: number
}

const RoomCard = ({ name, creationTime, numParticipants }: RoomCardProps) => {
    return (
        <a href={`/room-v1?roomName=${name}`} target="_blank">
            <Card className="cursor-pointer">
                <CardHeader>
                    <CardTitle className="line-clamp-2">{name}</CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-between items-center gap-4 text-muted-foreground">
                    <span>{numParticipants} Participants</span>
                    <span>Created at: {formatShortDateTimeLocal(creationTime)}</span>
                </CardFooter>
            </Card>
        </a>
    )
}

export default RoomCard;


/* 
 sid: 'RM_QsNUT6vAayRz',
    name: "Mahfuzul's First Room",
    emptyTimeout: 300,
    departureTimeout: 20,
    maxParticipants: 0,
    creationTime: 1766656676n,
    creationTimeMs: 1766656676380n,
    turnPassword: '',
    enabledCodecs: [
      [Codec], [Codec],
      [Codec], [Codec],
      [Codec], [Codec],
      [Codec], [Codec]
    ],
    metadata: '',
    numParticipants: 1,
    numPublishers: 1,
    activeRecording: false,
*/