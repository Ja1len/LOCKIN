import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth-server";

const patchSchema = z.object({
  name: z.string().trim().min(1).optional(),
  institution: z.string().trim().optional(),
  course: z.string().trim().optional(),
  subjects: z.array(z.string()).optional(),
  theme: z.enum(["clean", "focus", "energy"]).optional(),
  dailyGoalMinutes: z.number().int().min(5).max(720).optional(),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  return NextResponse.json({ profile: user });
}

export async function PATCH(req: NextRequest) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = patchSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid profile update." }, { status: 400 });
  }
  const updates = parsed.data;

  const [updated] = await db
    .update(users)
    .set({
      ...updates,
      ...(updates.name ? { avatarInitial: updates.name.charAt(0).toUpperCase() } : {}),
    })
    .where(eq(users.id, sessionUser.id))
    .returning();

  const { passwordHash: _omit, ...safeUser } = updated;
  return NextResponse.json({ profile: safeUser });
}
