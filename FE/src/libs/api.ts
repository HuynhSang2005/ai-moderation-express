export type ModerationDebug = {
  model?: string;
  threshold?: number;
  raw?: unknown;
  // các token BE trả để FE highlight
  offending?: string[];
  badwordsMatched?: string[];
};

export type ModerationResp = {
  allowed: boolean;
  reasons: string[];
  // BE có thể trả trực tiếp ở root
  offending?: string[];
  debug?: ModerationDebug;
};

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export async function moderateText(text: string): Promise<ModerationResp> {
  const res = await fetch(`${API_BASE}/comments/moderate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Request failed ${res.status}: ${msg}`);
  }
  return res.json() as Promise<ModerationResp>;
}
