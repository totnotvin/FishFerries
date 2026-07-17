import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const [visitor, hotelStaff, , parkStaff, admin] = await Promise.all([
    prisma.user.upsert({
      where: { email: "visitor@picnicisland.test" },
      update: {},
      create: {
        name: "Vinny Visitor",
        email: "visitor@picnicisland.test",
        passwordHash: password,
        role: "VISITOR",
      },
    }),
    prisma.user.upsert({
      where: { email: "hotel@picnicisland.test" },
      update: {},
      create: {
        name: "Hana Hotelier",
        email: "hotel@picnicisland.test",
        passwordHash: password,
        role: "HOTEL_STAFF",
      },
    }),
    prisma.user.upsert({
      where: { email: "ferry@picnicisland.test" },
      update: {},
      create: {
        name: "Fred Ferryman",
        email: "ferry@picnicisland.test",
        passwordHash: password,
        role: "FERRY_STAFF",
      },
    }),
    prisma.user.upsert({
      where: { email: "park@picnicisland.test" },
      update: {},
      create: {
        name: "Priya Parkkeeper",
        email: "park@picnicisland.test",
        passwordHash: password,
        role: "PARK_STAFF",
      },
    }),
    prisma.user.upsert({
      where: { email: "admin@picnicisland.test" },
      update: {},
      create: {
        name: "Alex Admin",
        email: "admin@picnicisland.test",
        passwordHash: password,
        role: "ADMIN",
      },
    }),
  ]);

  const hotel = await prisma.hotel.upsert({
    where: { id: "seed-hotel-lagoon" },
    update: {},
    create: {
      id: "seed-hotel-lagoon",
      name: "Lagoon View Resort",
      description: "Beachfront rooms with private lagoon access.",
      location: "North Shore, Picnic Island",
    },
  });

  const hotel2 = await prisma.hotel.upsert({
    where: { id: "seed-hotel-palm" },
    update: {},
    create: {
      id: "seed-hotel-palm",
      name: "Palm Grove Inn",
      description: "Cozy garden bungalows near the ferry pier.",
      location: "East Pier, Picnic Island",
    },
  });

  const roomData = [
    { id: "seed-room-standard", hotelId: hotel.id, type: "Standard Room", pricePerNight: 120, capacity: 2, totalUnits: 8 },
    { id: "seed-room-deluxe", hotelId: hotel.id, type: "Deluxe Lagoon Suite", pricePerNight: 220, capacity: 4, totalUnits: 4 },
    { id: "seed-room-family", hotelId: hotel.id, type: "Family Villa", pricePerNight: 300, capacity: 6, totalUnits: 3 },
    { id: "seed-room-bungalow", hotelId: hotel2.id, type: "Garden Bungalow", pricePerNight: 95, capacity: 2, totalUnits: 10 },
  ];
  for (const r of roomData) {
    await prisma.room.upsert({ where: { id: r.id }, update: {}, create: r });
  }

  const now = new Date("2026-08-01T00:00:00Z");
  const inDays = (n: number) => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

  const scheduleData = [
    { id: "seed-ferry-morning", origin: "Mainland Pier", destination: "Picnic Island", departureTime: inDays(2), capacity: 60 },
    { id: "seed-ferry-afternoon", origin: "Mainland Pier", destination: "Picnic Island", departureTime: new Date(inDays(2).getTime() + 6 * 3600 * 1000), capacity: 60 },
    { id: "seed-ferry-return", origin: "Picnic Island", destination: "Mainland Pier", departureTime: inDays(5), capacity: 60 },
  ];
  for (const s of scheduleData) {
    await prisma.ferrySchedule.upsert({ where: { id: s.id }, update: {}, create: s });
  }

  const eventData = [
    { id: "seed-ride-1", type: "RIDE" as const, name: "Coral Coaster", description: "High-speed coaster over the reef.", date: inDays(3), time: "10:00", capacity: 40, price: 25 },
    { id: "seed-ride-2", type: "RIDE" as const, name: "Volcano Drop Tower", description: "150ft freefall drop tower.", date: inDays(3), time: "11:30", capacity: 30, price: 30 },
    { id: "seed-show-1", type: "SHOW" as const, name: "Sunset Dolphin Show", description: "Live dolphin performance at dusk.", date: inDays(3), time: "18:00", capacity: 100, price: 15 },
    { id: "seed-beach-1", type: "BEACH_EVENT" as const, name: "Bonfire & Beach Volleyball", description: "Evening bonfire with games and music.", date: inDays(4), time: "19:00", capacity: 80, price: 0 },
    { id: "seed-beach-2", type: "BEACH_EVENT" as const, name: "Sunrise Yoga", description: "Guided beach yoga session.", date: inDays(4), time: "06:30", capacity: 25, price: 10 },
  ];
  for (const e of eventData) {
    await prisma.parkEvent.upsert({ where: { id: e.id }, update: {}, create: e });
  }

  const promoData = [
    { id: "seed-promo-1", title: "Early Bird Hotel Discount", description: "Book 30 days ahead and save 15% on any room.", imageEmoji: "🏨", scope: "HOTEL" as const, createdById: hotelStaff.id },
    { id: "seed-promo-2", title: "Coaster + Show Combo", description: "Bundle Coral Coaster with the Dolphin Show and save.", imageEmoji: "🎢", scope: "PARK" as const, createdById: parkStaff.id },
    { id: "seed-promo-3", title: "Welcome to Picnic Island!", description: "New theme park opening this season — plan your trip today.", imageEmoji: "🎉", scope: "GENERAL" as const, createdById: admin.id },
  ];
  for (const p of promoData) {
    await prisma.promotion.upsert({ where: { id: p.id }, update: {}, create: p });
  }

  const locationData = [
    { id: "seed-loc-1", name: "Lagoon View Resort", description: "Beachfront hotel with lagoon access.", category: "Hotel", x: 20, y: 30, createdById: admin.id },
    { id: "seed-loc-2", name: "Palm Grove Inn", description: "Garden bungalows near the pier.", category: "Hotel", x: 62, y: 22, createdById: admin.id },
    { id: "seed-loc-3", name: "East Pier Ferry Terminal", description: "Ferry arrivals & departures.", category: "Ferry", x: 85, y: 18, createdById: admin.id },
    { id: "seed-loc-4", name: "Coral Coaster", description: "The island's tallest roller coaster.", category: "Theme Park", x: 45, y: 55, createdById: admin.id },
    { id: "seed-loc-5", name: "Sunset Beach", description: "Home to the nightly bonfire and beach events.", category: "Beach", x: 30, y: 75, createdById: admin.id },
    { id: "seed-loc-6", name: "Island Grill", description: "Casual dining with ocean views.", category: "Dining", x: 55, y: 40, createdById: admin.id },
  ];
  for (const l of locationData) {
    await prisma.mapLocation.upsert({ where: { id: l.id }, update: {}, create: l });
  }

  // A sample confirmed hotel booking + ferry ticket for the demo visitor, so /ferry and /bookings show data immediately.
  const sampleBooking = await prisma.hotelBooking.upsert({
    where: { id: "seed-hotelbooking-1" },
    update: {},
    create: {
      id: "seed-hotelbooking-1",
      userId: visitor.id,
      roomId: "seed-room-standard",
      checkIn: inDays(2),
      checkOut: inDays(5),
      guests: 2,
      totalPrice: 360,
      status: "CONFIRMED",
    },
  });

  await prisma.ferryTicket.upsert({
    where: { id: "seed-ferryticket-1" },
    update: {},
    create: {
      id: "seed-ferryticket-1",
      userId: visitor.id,
      scheduleId: "seed-ferry-morning",
      hotelBookingId: sampleBooking.id,
      passengers: 2,
      status: "CONFIRMED",
    },
  });

  console.log("Seed complete. Demo accounts (password: password123):");
  console.log("  visitor@picnicisland.test / VISITOR");
  console.log("  hotel@picnicisland.test / HOTEL_STAFF");
  console.log("  ferry@picnicisland.test / FERRY_STAFF");
  console.log("  park@picnicisland.test / PARK_STAFF");
  console.log("  admin@picnicisland.test / ADMIN");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
