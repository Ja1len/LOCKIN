import "server-only";
import OpenAI from "openai";
import { z } from "zod";

let client: OpenAI | null = null;

function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.NVIDIA_NIM_API_KEY,
      baseURL: "https://integrate.api.nvidia.com/v1",
    });
  }
  return client;
}

const MODEL = "meta/llama-3.1-8b-instruct";

// Smaller instruct models sometimes return "options" as a single delimited
// string instead of an array — normalize before validating.
const optionsField = z.preprocess((val) => {
  if (typeof val === "string") {
    return val
      .split(/\n|\||(?:^|\s)[A-D][).]\s*/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return val;
}, z.array(z.string()).length(4));

const questionSchema = z.object({
  question: z.string(),
  options: optionsField,
  correctIndex: z.number().int().min(0).max(3),
  explanation: z.string(),
  topic: z.string(),
});

const flashcardSchema = z.object({
  front: z.string(),
  back: z.string(),
  topic: z.string(),
});

const topicsSummarySchema = z.object({
  topics: z.array(z.string()).min(1).max(8),
  summary: z.object({
    keyConcepts: z.array(z.string()).min(1).max(6),
    formulas: z.array(z.object({ name: z.string(), formula: z.string(), note: z.string() })).max(6),
    takeaways: z.array(z.string()).min(1).max(6),
  }),
});

const flashcardsSchema = z.object({ flashcards: z.array(flashcardSchema).min(3).max(8) });
const questionsSchema = z.object({ questions: z.array(questionSchema).min(1).max(4) });

export type TopicsSummary = z.infer<typeof topicsSummarySchema>;
export type GeneratedFlashcard = z.infer<typeof flashcardSchema>;
export type GeneratedQuestion = z.infer<typeof questionSchema>;

function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1) return raw.slice(start, end + 1);
  return raw;
}

async function complete(systemPrompt: string, userContent: string, maxTokens: number): Promise<string> {
  const completion = await getClient().chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    temperature: 0.4,
    max_tokens: maxTokens,
  });
  return completion.choices[0]?.message?.content ?? "";
}

async function completeJson<T>(
  systemPrompt: string,
  userContent: string,
  schema: z.ZodType<T>,
  maxTokens: number
): Promise<T> {
  const raw = await complete(systemPrompt, userContent, maxTokens);
  try {
    return schema.parse(JSON.parse(extractJson(raw)));
  } catch {
    const repaired = await complete(
      systemPrompt,
      `${userContent}\n\nYour previous reply was not valid JSON matching the schema. Return ONLY the corrected JSON object, nothing else.`,
      maxTokens
    );
    return schema.parse(JSON.parse(extractJson(repaired)));
  }
}

function truncate(text: string) {
  return text.slice(0, 8000);
}

export async function generateTopicsAndSummary(pdfText: string): Promise<TopicsSummary> {
  const systemPrompt = `You are a study-material generator. Given text from a student's PDF, identify the main topics and produce a concise summary.

Respond with ONLY a single valid JSON object (no markdown fences, no commentary) matching exactly:
{ "topics": string[] (3-6 items), "summary": { "keyConcepts": string[] (2-5 items), "formulas": [{ "name": string, "formula": string, "note": string }] (empty array if none), "takeaways": string[] (2-5 items) } }`;

  return completeJson(
    systemPrompt,
    `Source text (extracted from a PDF):\n\n${truncate(pdfText)}`,
    topicsSummarySchema,
    1400
  );
}

export async function generateFlashcards(pdfText: string, topics: string[]): Promise<GeneratedFlashcard[]> {
  const systemPrompt = `You are a study-material generator. Given text from a student's PDF and its main topics, produce active-recall flashcards.

Respond with ONLY a single valid JSON object (no markdown fences, no commentary) matching exactly:
{ "flashcards": [{ "front": string, "back": string, "topic": string }] (5-7 items) }`;

  const result = await completeJson(
    systemPrompt,
    `Topics: ${topics.join(", ")}\n\nSource text:\n\n${truncate(pdfText)}`,
    flashcardsSchema,
    1400
  );
  return result.flashcards;
}

export async function generateQuestionBatch(
  pdfText: string,
  topics: string[],
  alreadyAsked: string[]
): Promise<GeneratedQuestion[]> {
  const systemPrompt = `You are a study-material generator. Given text from a student's PDF and its main topics, produce multiple-choice active-recall quiz questions.

Respond with ONLY a single valid JSON object (no markdown fences, no commentary). "options" MUST be a JSON array of exactly 4 short strings, never a single string. Example of the exact shape required:
{ "questions": [ { "question": "What is Newton's First Law also known as?", "options": ["The law of inertia", "The law of gravity", "The law of momentum", "The law of energy"], "correctIndex": 0, "explanation": "An object at rest stays at rest unless acted on by a force.", "topic": "Newton's First Law" } ] }

Produce exactly 3 questions in the "questions" array, each following that exact shape.

Do not repeat any of these already-asked questions: ${alreadyAsked.length > 0 ? alreadyAsked.join(" | ") : "(none yet)"}`;

  const result = await completeJson(
    systemPrompt,
    `Topics: ${topics.join(", ")}\n\nSource text:\n\n${truncate(pdfText)}`,
    questionsSchema,
    1400
  );
  return result.questions;
}
