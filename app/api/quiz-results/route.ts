import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { quizResults } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth-server";

const postSchema = z.object({
  documentId: z.string().uuid().optional(),
  documentTitle: z.string().min(1),
  subject: z.enum(["Mathematics", "Physics", "Computer Science", "Biology"]),
  score: z.number().int().nonnegative(),
  totalQuestions: z.number().int().positive(),
  percentage: z.number().int().min(0).max(100),
  strongTopics: z.array(z.string()).default([]),
  weakTopics: z.array(z.string()).default([]),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const results = await db
    .select()
    .from(quizResults)
    .where(eq(quizResults.userId, user.id))
    .orderBy(desc(quizResults.date));

  return NextResponse.json({ results });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = postSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid quiz result." }, { status: 400 });
  }

  const [result] = await db
    .insert(quizResults)
    .values({ ...parsed.data, userId: user.id })
    .returning();

  return NextResponse.json({ result });
}
