import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { aiDocuments } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth-server";
import { cloudinary } from "@/lib/cloudinary";
import { extractPdfText } from "@/lib/pdf";

export const runtime = "nodejs";

function formatFileSize(bytes: number) {
  return bytes > 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  const subject = formData.get("subject");

  if (!(file instanceof File) || file.type !== "application/pdf") {
    return NextResponse.json({ error: "Please upload a PDF file." }, { status: 400 });
  }
  if (typeof subject !== "string" || !subject) {
    return NextResponse.json({ error: "Subject is required." }, { status: 400 });
  }

  // One active document per user: delete the previous Cloudinary asset + row first.
  const [existing] = await db
    .select()
    .from(aiDocuments)
    .where(eq(aiDocuments.userId, user.id))
    .limit(1);
  if (existing) {
    await cloudinary.uploader.destroy(existing.cloudinaryPublicId, { resource_type: "raw" }).catch(() => {});
    await db.delete(aiDocuments).where(eq(aiDocuments.id, existing.id));
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadResult = await new Promise<{ public_id: string; secure_url: string; bytes: number }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "lockin/documents" },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error("Cloudinary upload failed"));
          resolve(result as { public_id: string; secure_url: string; bytes: number });
        }
      );
      stream.end(buffer);
    }
  );

  const { text, pageCount } = await extractPdfText(buffer);
  if (!text.trim()) {
    await cloudinary.uploader.destroy(uploadResult.public_id, { resource_type: "raw" }).catch(() => {});
    return NextResponse.json({ error: "Couldn't extract any text from that PDF." }, { status: 422 });
  }

  // AI generation happens in short, separately-polled steps (see
  // /api/documents/[id]/advance) so no single request risks exceeding
  // Vercel's serverless function time limit.
  const [document] = await db
    .insert(aiDocuments)
    .values({
      userId: user.id,
      title: file.name,
      subject,
      cloudinaryPublicId: uploadResult.public_id,
      cloudinaryUrl: uploadResult.secure_url,
      pageCount,
      fileSize: formatFileSize(uploadResult.bytes),
      extractedText: text,
      status: "pending",
      generationStep: "topics_summary",
    })
    .returning();

  return NextResponse.json({ document });
}
