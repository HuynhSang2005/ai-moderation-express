export const config = {
  provider: process.env.PROVIDER ?? "huggingface",
  hfKey: process.env.HF_API_KEY ?? "",
  hfModel: process.env.HF_MODEL ?? "unitary/toxic-bert",
  hfThreshold: Number(process.env.HF_THRESHOLD ?? "0.5"),
  hfTop1Fallback: Number(process.env.HF_TOP1_FALLBACK ?? "0.7"),
  vnRulesEnabled: String(process.env.VN_RULES_ENABLED ?? "true") === "true",
  vnRulesStrict: String(process.env.VN_RULES_STRICT ?? "false") === "true",
  cacheTtlMs: Number(process.env.CACHE_TTL_MS ?? "0"),
  providerDebug: String(process.env.PROVIDER_DEBUG ?? "false") === "true",
  openaiKey: process.env.OPENAI_API_KEY ?? ""
};
