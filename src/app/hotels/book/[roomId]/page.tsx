import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HotelBookingForm } from "@/components/HotelBookingForm";

export default async function BookRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { hotel: true },
  });
  if (!room) notFound();

  return (
    <div className="mx-auto max-w-lg w-full px-4 py-10">
      <div className="card">
        <h1 className="text-xl font-semibold">{room.hotel.name}</h1>
        <p className="text-sm text-neutral-500 mb-6">{room.type} · {room.hotel.location}</p>
        <HotelBookingForm
          roomId={room.id}
          pricePerNight={room.pricePerNight}
          capacity={room.capacity}
        />
      </div>
    </div>
  );
}
