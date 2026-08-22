import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword, signSessionToken, setSessionCookie } from "@/lib/auth-server";

const SUBJECTS = ["Mathematics", "Physics", "Computer Science", "Biology"] as const;

const bodySchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  password: z.string().min(4),
  institution: z.string().trim().optional().default("Sunway University"),
  course: z.string().trim().optional().default("General Studies"),
  subjects: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration details." }, { status: 400 });
  }
  const data = parsed.data;
  const email = data.email.toLowerCase();

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists. Please log in instead." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(data.password);
  const subjects =
    data.subjects && data.subjects.length > 0 ? data.subjects : [...SUBJECTS.slice(0, 3)];

  const [user] = await db
    .insert(users)
    .values({
      name: data.name,
      email,
      passwordHash,
      institution: data.institution || "Sunway University",
      course: data.course || "General Studies",
      subjects,
      avatarInitial: data.name.charAt(0).toUpperCase() || "S",
      lastLoginAt: new Date(),
    })
    .returning();

  const token = await signSessionToken(user.id);
  await setSessionCookie(token);

  const { passwordHash: _omit, ...safeUser } = user;
  return NextResponse.json({ user: safeUser });
}
