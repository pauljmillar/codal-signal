"use client";
import { scoreColor } from "@/lib/scoring";

export default function ScoreRing({
  value,
  label,
  size = 64,
}: {
  value: number;
  label: string;
  size?: number;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = 27;
  const c = 2 * Math.PI * r;
  const dash = (v / 100) * c;
  const color =
    scoreColor(v) === "success"
      ? "#22C55E"
      : scoreColor(v) === "warning"
      ? "#F59E0B"
      : "#EF4444";
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
        <circle
          cx="32"
          cy="32"
          r={r}
          stroke={color}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          transform="rotate(-90 32 32)"
          style={{ transition: "stroke-dasharray 0.6s ease-out" }}
        />
        <text x="32" y="37" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff">
          {v}
        </text>
      </svg>
      <div
        className="mt-1"
        style={{
          fontSize: 10,
          fontWeight: 500,
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}
