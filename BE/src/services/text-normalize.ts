export function normalizeForModeration(input: string): string {
  // NFKC để chuẩn hoá unicode
  let s = input.normalize("NFKC").toLowerCase();

  // Chuyển leetspeak cơ bản
  const leet: Record<string, string> = { "0":"o", "1":"i", "3":"e", "4":"a", "5":"s", "7":"t", "@":"a", "$":"s" };
  s = s.replace(/[013457@$]/g, (ch) => leet[ch] ?? ch);

  // Bỏ dấu tiếng Việt
  s = stripVietnameseDiacritics(s);

  // Nén khoảng trắng
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

export function stripVietnameseDiacritics(str: string): string {
  // giản lược nhanh
  return str
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D");
}
