import { prisma } from "@/lib/prisma";
import { IslandMap } from "@/components/IslandMap";

export default async function MapPage() {
  const locations = await prisma.mapLocation.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-4xl w-full px-4 py-10">
      <h1 className="font-display text-2xl font-medium mb-1 text-lagoon-900 dark:text-sand-50">Island Map</h1>
      <p className="text-neutral-500 mb-6">Tap a pin to see what&apos;s there.</p>
      <IslandMap locations={locations} />
    </div>
  );
}
