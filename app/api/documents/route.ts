import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { aiDocuments } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth-server";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const documents = await db
    .select()
    .from(aiDocuments)
    .where(eq(aiDocuments.userId, user.id))
    .orderBy(desc(aiDocuments.uploadedAt));

  return NextResponse.json({ documents });
}
