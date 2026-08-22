import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { aiDocuments } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/auth-server";
import { generateTopicsAndSummary, generateFlashcards, generateQuestionBatch } from "@/lib/ai-provider";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const [doc] = await db.select().from(aiDocuments).where(eq(aiDocuments.id, id)).limit(1);
  if (!doc || doc.userId !== user.id) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  if (doc.status === "ready" || doc.generationStep === "done") {
    return NextResponse.json({ document: doc, done: true });
  }

  const text = doc.extractedText || "";

  try {
    let updated;
    switch (doc.generationStep) {
      case "topics_summary": {
        const { topics, summary } = await generateTopicsAndSummary(text);
        [updated] = await db
          .update(aiDocuments)
          .set({ topics, summary, generationStep: "flashcards", status: "pending", errorMessage: null })
          .where(eq(aiDocuments.id, id))
          .returning();
        break;
      }
      case "flashcards": {
        const flashcards = await generateFlashcards(text, doc.topics);
        [updated] = await db
          .update(aiDocuments)
          .set({
            flashcards: flashcards.map((f, i) => ({ id: `f${i + 1}`, ...f })),
            generationStep: "questions_1",
            status: "pending",
            errorMessage: null,
          })
          .where(eq(aiDocuments.id, id))
          .returning();
        break;
      }
      case "questions_1": {
        const questions = await generateQuestionBatch(text, doc.topics, []);
        [updated] = await db
          .update(aiDocuments)
          .set({
            questions: questions.map((q, i) => ({ id: `q${i + 1}`, ...q })),
            generationStep: "questions_2",
            status: "pending",
            errorMessage: null,
          })
          .where(eq(aiDocuments.id, id))
          .returning();
        break;
      }
      case "questions_2": {
        const existingQuestions = doc.questions as { question: string }[];
        const more = await generateQuestionBatch(
          text,
          doc.topics,
          existingQuestions.map((q) => q.question)
        );
        const combined = [
          ...existingQuestions,
          ...more.map((q, i) => ({ id: `q${existingQuestions.length + i + 1}`, ...q })),
        ];
        [updated] = await db
          .update(aiDocuments)
          .set({ questions: combined, generationStep: "done", status: "ready" })
          .where(eq(aiDocuments.id, id))
          .returning();
        break;
      }
      default:
        return NextResponse.json({ error: "Unknown generation step" }, { status: 500 });
    }

    return NextResponse.json({ document: updated, done: updated.generationStep === "done" });
  } catch (err) {
    console.error(`advance failed at step ${doc.generationStep} for doc ${id}:`, err);
    await db
      .update(aiDocuments)
      .set({ status: "failed", errorMessage: err instanceof Error ? err.message : "Generation failed" })
      .where(eq(aiDocuments.id, id));
    return NextResponse.json({ error: "AI generation failed. Please try uploading again." }, { status: 500 });
  }
}
