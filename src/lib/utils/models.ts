export function setNote(value: number | undefined) {
  if (value === undefined) return "";
  if (value < 11) return "C";
  if (value < 14) return "B";
  if (value < 18) return "A";
  return "AD";
}

export function setColor(value: number | undefined) {
  if (value === undefined) return ""
  if (value < 10.5) return "var(--red)"
  return "var(--blue)"
}