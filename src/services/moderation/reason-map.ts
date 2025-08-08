export function normalizeOpenAIReasons(categories: Record<string, boolean>): string[] {
  const reasons: string[] = [];
  for (const k of Object.keys(categories)) {
    if (!categories[k]) continue;

    if (k.includes("harassment")) reasons.push("harassment");
    else if (k.includes("hate")) reasons.push("hate");
    else if (k.includes("sexual")) reasons.push("sexual");
    else if (k.includes("self-harm")) reasons.push("self-harm");
    else if (k.includes("violence")) reasons.push("violence");
    else reasons.push(k);
  }
  return Array.from(new Set(reasons));
}
