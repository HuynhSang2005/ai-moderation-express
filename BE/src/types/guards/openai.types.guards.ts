import type { OpenAIModerationResponse } from "../openai.types";

export default function isOpenAIModerationResponse(data: any): data is OpenAIModerationResponse {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.results) &&
    data.results.length >= 0
  );
}