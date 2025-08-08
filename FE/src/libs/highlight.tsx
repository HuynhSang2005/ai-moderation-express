// Map reason -> list từ khóa (demo)
export const REASON_KEYWORDS: Record<string, string[]> = {
  harassment: ["idiot", "stupid", "đồ ngu", "câm mồm", "vãi"],
  hate: ["hate", "racist", "phân biệt", "chủng tộc"],
  sexual: ["sex", "xxx", "địt", "dâm"],
  violence: ["kill", "chém", "giết", "đâm"],
  spam: ["khuyến mãi", "click ngay", "free money"],
};

export function highlightText(
  text: string,
  reasons: string[]
): (string | JSX.Element)[] {
  let parts: (string | JSX.Element)[] = [text];

  reasons.forEach((reason) => {
    const keywords = REASON_KEYWORDS[reason] || [];
    keywords.forEach((kw) => {
      const regex = new RegExp(`(${escapeRegex(kw)})`, "gi");
      parts = parts.flatMap((part) => {
        if (typeof part !== "string") return [part];
        return part.split(regex).map((p, i) =>
          regex.test(p) ? (
            <mark
              key={`${kw}-${i}`}
              style={{ backgroundColor: "#fff3bf" }}
            >
              {p}
            </mark>
          ) : (
            p
          )
        );
      });
    });
  });

  return parts;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
