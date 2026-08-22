import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { rooms, chatMessages } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth-server";
import { pusherServer } from "@/lib/pusher-server";

const postSchema = z.object({
  text: z.string().trim().min(1).max(2000),
});

async function getRoomBySlug(slug: string) {
  const [room] = await db.select().from(rooms).where(eq(rooms.slug, slug)).limit(1);
  return room;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.roomId, room.id))
    .orderBy(asc(chatMessages.createdAt));

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      name: m.senderName,
      time: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: m.text,
      tone: m.tone,
    })),
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

  const parsed = postSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Message text is required." }, { status: 400 });
  }

  const [message] = await db
    .insert(chatMessages)
    .values({
      roomId: room.id,
      userId: user.id,
      senderName: user.name,
      text: parsed.data.text,
    })
    .returning();

  const payload = {
    id: message.id,
    name: message.senderName,
    time: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    text: message.text,
    tone: message.tone,
  };

  await pusherServer.trigger(`room-${slug}`, "new-message", payload);

  return NextResponse.json({ message: payload });
}
