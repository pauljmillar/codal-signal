export function clampScore(n: any): number {
  const v = Math.round(Number(n) || 0);
  return Math.max(0, Math.min(100, v));
}

export function scoreColor(n: number): "success" | "warning" | "error" {
  if (n >= 70) return "success";
  if (n >= 40) return "warning";
  return "error";
}
