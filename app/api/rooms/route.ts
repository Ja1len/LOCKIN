import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { rooms, roomParticipants } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth-server";
import { ACCENTS, serializeRoom, toSlug } from "@/lib/rooms-server";

const postSchema = z.object({
  name: z.string().trim().min(1),
  subject: z.enum(["Mathematics", "Physics", "Computer Science", "Biology"]),
  topic: z.string().trim().min(1),
  type: z.enum(["Silent Focus", "Teaching", "Discussion"]),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const allRooms = await db.select().from(rooms);
  const serialized = await Promise.all(allRooms.map(serializeRoom));
  return NextResponse.json({ rooms: serialized });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = postSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid room data." }, { status: 400 });
  }
  const data = parsed.data;

  const [room] = await db
    .insert(rooms)
    .values({
      slug: toSlug(data.name),
      name: data.name,
      subject: data.subject,
      topic: data.topic,
      type: data.type,
      accent: ACCENTS[data.type],
      goal: `Study ${data.topic}`,
      hostUserId: user.id,
    })
    .returning();

  await db.insert(roomParticipants).values({
    roomId: room.id,
    userId: user.id,
    role: "Host",
    isHost: true,
  });

  return NextResponse.json({ room: await serializeRoom(room) });
}
