import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { todos } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth-server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;

  const [todo] = await db
    .update(todos)
    .set({ completed: true, completedAt: new Date() })
    .where(and(eq(todos.id, id), eq(todos.userId, user.id)))
    .returning();

  if (!todo) return NextResponse.json({ error: "Task not found" }, { status: 404 });

  return NextResponse.json({ todo });
}
