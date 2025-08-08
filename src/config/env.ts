export const config = {
  provider: process.env.PROVIDER ?? "openai",
  openaiKey: process.env.OPENAI_API_KEY ?? "",
  hfKey: process.env.HF_API_KEY ?? "",
  hfModel: process.env.HF_MODEL ?? "unitary/toxic-bert",
  hfThreshold: Number(process.env.HF_THRESHOLD ?? "0.5"),
  providerDebug: String(process.env.PROVIDER_DEBUG ?? "false") === "true",
};
