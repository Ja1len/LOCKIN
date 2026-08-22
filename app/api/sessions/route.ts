import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { studySessions } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth-server";

const postSchema = z.object({
  subject: z.enum(["Mathematics", "Physics", "Computer Science", "Biology"]),
  duration: z.number().int().positive().default(25),
  roomName: z.string().optional(),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const sessions = await db
    .select()
    .from(studySessions)
    .where(eq(studySessions.userId, user.id))
    .orderBy(desc(studySessions.date));

  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = postSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid session data." }, { status: 400 });
  }

  const [session] = await db
    .insert(studySessions)
    .values({
      userId: user.id,
      subject: parsed.data.subject,
      duration: parsed.data.duration,
      roomName: parsed.data.roomName,
    })
    .returning();

  return NextResponse.json({ session });
}
