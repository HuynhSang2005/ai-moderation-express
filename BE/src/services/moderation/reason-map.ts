// taxonomy chung
export type Reason =
  | "hate"
  | "harassment"
  | "sexual"
  | "self-harm"
  | "violence"
  | "spam"
  | "drugs"
  | "crime"
  | "other";

const PUSH = (arr: Reason[], x: Reason) => { if (!arr.includes(x)) arr.push(x); };

// HF: nhận labels đa dạng -> map về Reason[]
export function normalizeHFLabels(labels: string[]): Reason[] {
  const reasons: Reason[] = [];

  for (const raw of labels) {
    const label = raw.toLowerCase();

    // nhóm hate
    if (label.includes("hate") || label.includes("homophobia") || label.includes("racism") || label.includes("religion")) {
      PUSH(reasons, "hate");
      continue;
    }

    // nhóm harassment/abuse
    if (
      label.includes("toxic") ||
      label.includes("insult") ||
      label.includes("abuse") ||
      label.includes("harassment") ||
      label.includes("offensive")
    ) {
      PUSH(reasons, "harassment");
      continue;
    }

    // sexual/explicit
    if (label.includes("sexual") || label.includes("porn") || label.includes("adult")) {
      PUSH(reasons, "sexual");
      continue;
    }

    // self-harm/suicide
    if (label.includes("self-harm") || label.includes("suicide") || label.includes("self harm")) {
      PUSH(reasons, "self-harm");
      continue;
    }

    // violence/threats
    if (label.includes("violence") || label.includes("threat") || label.includes("terror")) {
      PUSH(reasons, "violence");
      continue;
    }

    // spam/scam
    if (label.includes("spam") || label.includes("scam") || label.includes("advertising")) {
      PUSH(reasons, "spam");
      continue;
    }

    // drugs
    if (label.includes("drug") || label.includes("narcotic")) {
      PUSH(reasons, "drugs");
      continue;
    }

    // crime/illegal
    if (label.includes("illegal") || label.includes("crime") || label.includes("weapon")) {
      PUSH(reasons, "crime");
      continue;
    }

    // fallback
    PUSH(reasons, "other");
  }

  return reasons;
}
