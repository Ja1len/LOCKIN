declare module "pdf-parse/lib/pdf-parse.js" {
  import type { Result } from "pdf-parse";
  function pdfParse(data: Uint8Array | Buffer, options?: unknown): Promise<Result>;
  export default pdfParse;
}
