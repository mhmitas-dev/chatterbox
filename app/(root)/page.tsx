import { Room, RoomServiceClient } from "livekit-server-sdk";
import RoomCard from "./RoomCard";

const Home = async () => {

  const roomService = new RoomServiceClient(
    process.env.LIVEKIT_URL!,
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
  );

  // List all rooms 
  const rooms: Room[] = await roomService.listRooms()

  return (
    <main className="mt-10">
      <section className="grid grid-cols-2 gap-5 primary-container">
        {rooms.map((room, index) => (
          <RoomCard
            key={index}
            sid={room.sid}
            name={room.name}
            creationTime={room.creationTime}
            numParticipants={room.numParticipants}
          />
        ))}
      </section>
    </main>
  )
}

export default Home