import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { rooms, roomParticipants, users } from "@/lib/db/schema";

export const ACCENTS: Record<string, string> = {
  "Silent Focus": "#2d6a4f",
  Teaching: "#486581",
  Discussion: "#b56845",
};

export function toSlug(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now().toString().slice(-4)
  );
}

export async function serializeRoom(room: typeof rooms.$inferSelect) {
  const participants = await db
    .select({
      name: users.name,
      role: roomParticipants.role,
      isHost: roomParticipants.isHost,
      handRaised: roomParticipants.handRaised,
    })
    .from(roomParticipants)
    .innerJoin(users, eq(roomParticipants.userId, users.id))
    .where(eq(roomParticipants.roomId, room.id));

  const hostRow = room.hostUserId
    ? (await db.select({ name: users.name }).from(users).where(eq(users.id, room.hostUserId)).limit(1))[0]
    : undefined;

  return {
    id: room.slug,
    name: room.name,
    subject: room.subject,
    topic: room.topic,
    type: room.type,
    participantCount: participants.length,
    capacity: room.capacity,
    accent: room.accent,
    host: hostRow?.name,
    hostRole: room.hostRole ?? undefined,
    discussionQuestion: room.discussionQuestion ?? undefined,
    goal: room.goal ?? undefined,
    participants: participants.map((p) => ({
      name: p.name,
      initials: p.name
        .split(" ")
        .map((part) => part[0])
        .join(""),
      role: p.role,
      online: true,
      tone: "bg-emerald-100 text-emerald-800",
      isHost: p.isHost,
      handRaised: p.handRaised,
    })),
  };
}
