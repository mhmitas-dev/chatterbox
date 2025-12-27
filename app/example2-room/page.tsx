import Example2 from "@/components/Example2";
import { ResolvingMetadata } from "next";

const page = async (props: {
    searchParams?: Promise<{
        roomName?: string;
        participantName?: string;
    }>;
}) => {
    const searchParams = await props.searchParams;
    const roomName = searchParams?.roomName ?? ''
    const participantName = searchParams?.participantName ?? ''

    if (!roomName || !participantName) {
        return <div>I don't know your name and your room address either, So fuckoff</div>
    }

    return (
        <div>
            <Example2 roomName={roomName} participantName={participantName} />
        </div>
    )
}

export default page;

export async function generateMetadata(props: {
    searchParams?: Promise<{
        roomName?: string;
        participantName?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const roomName = searchParams?.roomName ?? ''
    const participantName = searchParams?.participantName ?? ''

    return {
        title: participantName,
        description: `The room name is ${roomName}, the the local participant is ${participantName}`,
    }
}