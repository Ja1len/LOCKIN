import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { todos } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth-server";

const postSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const items = await db
    .select()
    .from(todos)
    .where(and(eq(todos.userId, user.id), eq(todos.completed, false)))
    .orderBy(desc(todos.createdAt));

  return NextResponse.json({ todos: items });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const parsed = postSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "A task title is required." }, { status: 400 });
  }

  const [todo] = await db
    .insert(todos)
    .values({ userId: user.id, title: parsed.data.title })
    .returning();

  return NextResponse.json({ todo });
}
