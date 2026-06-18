import type { Brief } from "./types";

export type HistoryEntry = {
  id: string;
  url: string;
  company: string;
  industry: string;
  tier: "S" | "M" | "L";
  createdAt: number;
  brief: Brief;
};

const KEY = "signal:history";
const CAP = 50;

function safeParse(raw: string | null): HistoryEntry[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(KEY));
}

export function saveEntry(entry: HistoryEntry): HistoryEntry[] {
  if (typeof window === "undefined") return [entry];
  const existing = loadHistory().filter((e) => e.url !== entry.url);
  const next = [entry, ...existing].slice(0, CAP);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function deleteEntry(id: string): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const next = loadHistory().filter((e) => e.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function relativeTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString();
}
