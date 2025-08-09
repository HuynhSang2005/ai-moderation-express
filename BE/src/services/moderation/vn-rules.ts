import { stripVietnameseDiacritics } from "../text-normalize";

// danh sách demo, sau này có thể mở rộng dần
const BADWORDS = [
  /thang ngu/i, /do ngu/i, /oc cho/i, /lon/i, /dit/i, /cc/i, /dm/i, /cmm/i,
  /djt/i, /cu*t/i, /lo*n/i, /cuc cut/i, /ml/i, /vcl/i
];

export function violatesVietnameseRules(original: string): boolean {
  const s = stripVietnameseDiacritics(original.normalize("NFKC").toLowerCase());
  return BADWORDS.some((re) => re.test(s));
}
