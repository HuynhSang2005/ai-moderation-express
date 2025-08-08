import { raw } from "express";
import { config } from "../../config/env";
import isOpenAIModerationResponse from "../../types/guards/openai.types.guards";

// Minimal call using OpenAI's moderation API via fetch
// (sau có thể thay bằng SDK chính thức nếu muốn)
type ModerationDecision = { allowed: boolean; reasons: string[] };

export async function moderateWithOpenAI(text: string): Promise<ModerationDecision> {
  if (!config.openaiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const resp = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.openaiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "omni-moderation-latest",
      input: text
    })
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`OpenAI moderation failed: ${err}`);
  }

  if (!isOpenAIModerationResponse(raw)) {
    // nếu errors có thể log raw để debug
    throw new Error("Unexpected OpenAI moderation payload shape", { cause: raw });
  }

  const data = await resp.json();

  // Dựa trên format response moderation mới của OpenAI
  // Map về allowed/reasons đơn giản
  const first = raw.results[0];
  const categories = first?.categories ?? {};
  const flagged = first?.flagged ?? false;

  const reasons = Object.entries(categories)
    .filter(([_, v]) => Boolean(v))
    .map(([k]) => k);

  return { allowed: !flagged, reasons };
}
