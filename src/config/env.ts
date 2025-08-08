export const config = {
  provider: process.env.PROVIDER ?? "openai",
  openaiKey: process.env.OPENAI_API_KEY ?? "",
  hfKey: process.env.HF_API_KEY ?? ""
};
