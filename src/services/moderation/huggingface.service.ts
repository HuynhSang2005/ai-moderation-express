import { config } from "../../config/env";
import { normalizeHFLabels } from "./reason-map";

type ModerationDecision = { allowed: boolean; reasons: string[],debug?: any };

export async function moderateWithHF(text: string): Promise<ModerationDecision> {
  if (!config.hfKey) throw new Error("HF_API_KEY is missing");

    const endpoint = `https://api-inference.huggingface.co/models/${config.hfModel}`;

  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.hfKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`HF inference failed: ${resp.status} ${err}`);
  }

  // data là mảng label-score
  const data = await resp.json();
  // HF trả kiểu: [[{label: 'toxic', score: 0.87}, {label:'neutral', score:0.13}]]
  const arr = Array.isArray(data) ? data[0] : [];
  const activeLabels: string[] = [];


  for (const it of arr ?? []) {
    // rule đơn giản: lấy các label có score > 0.5 (tùy model mà bạn chỉnh threshold)
    if (typeof it?.label === "string" && typeof it?.score === "number" && it.score >= config.hfThreshold) {
      activeLabels.push(it.label);
    }
  }

  const reasons = normalizeHFLabels(activeLabels);
  const decision: ModerationDecision = {
    allowed: reasons.length === 0,
    reasons,
  };

  if (config.providerDebug) decision.debug = { model: config.hfModel, threshold: config.hfThreshold, raw: data };

  return decision;
}
