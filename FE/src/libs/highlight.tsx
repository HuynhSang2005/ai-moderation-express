import type { ReactNode } from "react";

// Fallback demo khi BE không trả tokens:
const FALLBACK_REASON_KEYWORDS: Record<string, string[]> = {
  harassment: ["idiot", "stupid", "đồ ngu", "câm mồm", "vãi"],
  hate: ["hate", "racist", "phân biệt", "chủng tộc"],
  sexual: ["sex", "xxx", "địt", "dâm"],
  violence: ["kill", "chém", "giết", "đâm"],
  spam: ["khuyến mãi", "click ngay", "free money"],
};

type HighlightOpts = {
  // tokens do BE trả về: offending hoặc debug.badwordsMatched
  tokensFromBE?: string[] | undefined;
};

/**
 * Ưu tiên highlight bằng tokens do BE trả (offending/badwordsMatched).
 * Nếu không có, fallback theo reasons với list demo.
 */
export function highlightText(
  text: string,
  reasons: string[],
  opts: HighlightOpts = {}
): ReactNode[] {
  const tokens = pickTokens(tokensFromBackendCandidates(opts, reasons));

  // Có token từ BE -> highlight chính xác theo token
  if (tokens.length > 0) {
    return highlightByTokens(text, tokens);
  }

  // Fallback đơn giản theo reasons (demo)
  const fallbackTokens = reasons.flatMap((r) => FALLBACK_REASON_KEYWORDS[r] ?? []);
  if (fallbackTokens.length > 0) {
    return highlightByTokens(text, fallbackTokens);
  }

  // Không có gì để highlight
  return [text];
}

/** Gom các nguồn token khả dụng từ backend */
function tokensFromBackendCandidates(opts: HighlightOpts, reasons: string[]) {
  // Có thể mở rộng logic chọn nguồn token tùy bạn
  return {
    beTokens: opts.tokensFromBE ?? [],
    // future: có thể map theo reason -> tokens chuyên biệt từ BE
  };
}

/** Chọn token unique, loại rỗng */
function pickTokens(src: { beTokens: string[] }) {
  const set = new Set(
    (src.beTokens || [])
      .map((s) => (typeof s === "string" ? s.trim() : ""))
      .filter(Boolean)
  );
  return Array.from(set);
}

/** Highlight theo danh sách token (case-insensitive, giữ nguyên text gốc) */
function highlightByTokens(text: string, tokens: string[]): ReactNode[] {
  if (tokens.length === 0) return [text];

  // Tạo 1 regex union: (tok1|tok2|tok3)
  const pattern = tokens
    .map((t) => escapeRegex(t))
    .filter(Boolean)
    .join("|");

  if (!pattern) return [text];

  const re = new RegExp(`(${pattern})`, "gi");
  const parts: ReactNode[] = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const [hit] = match;
    const start = match.index;
    const end = start + hit.length;

    if (start > lastIndex) parts.push(text.slice(lastIndex, start));

    parts.push(
      <mark key={`hl-${start}-${end}`} style={{ backgroundColor: "#fff3bf" }}>
        {text.slice(start, end)}
      </mark>
    );

    lastIndex = end;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
