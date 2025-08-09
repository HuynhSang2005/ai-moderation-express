import { config } from "../../config/env";
import { normalizeHFLabels } from "./reason-map";
import { normalizeForModeration } from "../text-normalize";
import { violatesVietnameseRules } from "./vn-rules";

// Simple in-memory cache (optional)
const cache = new Map<string, { data: any; at: number }>();

type ModerationDecision = { allowed: boolean; reasons: string[]; debug?: any };

export async function moderateWithHF(text: string): Promise<ModerationDecision> {
  if (!config.hfKey) throw new Error("HF_API_KEY is missing");
  const endpoint = `https://api-inference.huggingface.co/models/${config.hfModel}`;

  // CACHE
  const key = `${config.hfModel}|${text}`;
  const cached = cache.get(key);
  if (cached && config.cacheTtlMs > 0 && Date.now() - cached.at < config.cacheTtlMs) {
    return cached.data;
  }

  // Chuẩn hoá để model nhạy hơn (không gửi chuỗi đã bỏ dấu nếu bạn muốn giữ nguyên -> có thể gửi cả 2)
  const normalized = normalizeForModeration(text);

  const resp = await fetch(`${endpoint}?wait_for_model=true`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.hfKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ inputs: normalized })
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`HF inference failed: ${resp.status} ${err}`);
  }

  const data = await resp.json();
  const arr = Array.isArray(data) ? data[0] : [];

  // 1) Threshold linh hoạt per-label (nếu cần bạn có thể đặt map riêng)
  const activeLabels: string[] = [];
  for (const it of arr ?? []) {
    if (typeof it?.label === "string" && typeof it?.score === "number") {
      if (it.score >= config.hfThreshold) activeLabels.push(it.label);
    }
  }

  // 2) Top-1 fallback: nếu không qua ngưỡng, nhưng top1 đủ cao so với ngưỡng
  if (activeLabels.length === 0 && Array.isArray(arr) && arr.length > 0) {
    const top = [...arr].sort((a: any, b: any) => b.score - a.score)[0];
    if (top?.score >= config.hfThreshold * config.hfTop1Fallback) {
      activeLabels.push(top.label);
    }
  }

  // 3) Map về taxonomy chung
  let reasons = normalizeHFLabels(activeLabels);

  // 4) VN override layer
  if (config.vnRulesEnabled && violatesVietnameseRules(text)) {
    if (!reasons.includes("harassment")) reasons.push("harassment");
    if (config.vnRulesStrict) {
      // có thể đẩy thêm 'insult'/'hate' nếu muốn chặt chẽ hơn
      // reasons.push("hate") ... (optional)
    }
  }

  const decision: ModerationDecision = {
    allowed: reasons.length === 0,
    reasons,
    debug: config.providerDebug ? { model: config.hfModel, threshold: config.hfThreshold, raw: data } : undefined
  };

  if (config.cacheTtlMs > 0) cache.set(key, { data: decision, at: Date.now() });
  return decision;
}
