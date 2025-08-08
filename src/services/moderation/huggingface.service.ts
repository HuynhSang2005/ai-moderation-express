import { normalizeHFLabels } from "./reason-map";
import { config } from "../../config/env";


type ModerationDecision = { allowed: boolean; reasons: string[] };


export async function moderateWithHF(text: string): Promise<ModerationDecision> {
  const resp = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.hfKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "omni-moderation-latest",
        input: text
      })
    });
  // data là mảng label-score
  const data = await resp.json();

  // HF trả kiểu: [[{label: 'toxic', score: 0.87}, {label:'neutral', score:0.13}]]
  const arr = Array.isArray(data) ? data[0] : [];
  const activeLabels: string[] = [];

  for (const it of arr ?? []) {
    // rule đơn giản: lấy các label có score > 0.5 (tùy model mà bạn chỉnh threshold)
    if (typeof it?.label === "string" && typeof it?.score === "number" && it.score > 0.5) {
      activeLabels.push(it.label);
    }
  }

  const reasons = normalizeHFLabels(activeLabels);
  const allowed = reasons.length === 0; // nếu không có lý do vi phạm thì cho phép

  return { allowed, reasons };
}
