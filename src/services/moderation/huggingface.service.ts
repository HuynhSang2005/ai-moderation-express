import { config } from "../../config/env";

type ModerationDecision = { allowed: boolean; reasons: string[] };

// Ví dụ dùng model "unitary/toxic-bert" (binary toxicity).
export async function moderateWithHF(text: string): Promise<ModerationDecision> {
  if (!config.hfKey) throw new Error("HF_API_KEY is missing");

  const resp = await fetch(
    "https://api-inference.huggingface.co/models/unitary/toxic-bert",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.hfKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: text })
    }
  );

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`HF inference failed: ${err}`);
  }

  const data = await resp.json();
  // data: [[{label: 'toxic', score: 0.87}, {label:'neutral', score:0.13}]]
  const arr = Array.isArray(data) ? data[0] : [];
  const toxic = arr?.find((x: any) => x.label.toLowerCase().includes("toxic"));
  const isToxic = toxic && toxic.score > 0.5;

  return {
    allowed: !isToxic,
    reasons: isToxic ? ["toxic"] : []
  };
}
