"use client"

import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const Example2Form = () => {
    const [roomName, setRoomName] = useState("")
    const [participantName, setParticipantName] = useState("")
    const router = useRouter()

    const handleJoin = () => {
        if (!roomName || roomName.length <= 2) return toast.error("Enter the room name")
        if (!participantName || participantName.length <= 2) return toast.error("Enter Your Name")
        return router.push(`/example2-room?roomName=${roomName}&participantName=${participantName}`)
    }

    return (
        <div className="h-screen flex items-center justify-center w-full">
            <div className="bg-card p-6 rounded border border-border space-y-3">
                <Input
                    placeholder="Enter The Room Name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    name="roomName"
                />
                <Input
                    placeholder="Enter Your Name"
                    value={participantName}
                    name={"participantName"}
                    onChange={(e) => setParticipantName(e.target.value)}
                />
                <Button onClick={handleJoin}>Join</Button>
            </div>
        </div>
    )
}

export default Example2Form