import "server-only";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractPdfText(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
  // Pass a plain Uint8Array, not a Buffer instance — pdf-parse's bundled pdfjs
  // does `instanceof` checks that misfire on Buffer once webpack/esbuild has
  // bundled it, silently feeding it empty data and producing "bad XRef entry".
  const data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const result = await pdfParse(data);
  return { text: result.text, pageCount: result.numpages };
}
