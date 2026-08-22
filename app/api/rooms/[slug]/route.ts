import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { rooms, roomParticipants } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth-server";
import { serializeRoom } from "@/lib/rooms-server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { slug } = await params;
  const [room] = await db.select().from(rooms).where(eq(rooms.slug, slug)).limit(1);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  await db
    .insert(roomParticipants)
    .values({ roomId: room.id, userId: user.id, role: "Member" })
    .onConflictDoNothing();

  return NextResponse.json({ room: await serializeRoom(room) });
}
