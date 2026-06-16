"use client";
import { useEffect, useState } from "react";

const STEPS = [
  "Fetching page content...",
  "Scanning tech stack...",
  "Checking LLM visibility...",
  "Identifying friction points...",
  "Building your brief...",
];

export default function LoadingSteps() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timers: any[] = [];
    let acc = 0;
    const delays = [900, 1100, 1300, 1100, 1200];
    delays.forEach((d, i) => {
      acc += d;
      timers.push(setTimeout(() => setActive(i + 1), acc));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <div className="section-heading">Working</div>
      <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {STEPS.map((label, i) => {
          const state = i < active ? "done" : i === active ? "current" : "pending";
          return (
            <li
              key={i}
              className="fadein"
              style={{
                animationDelay: `${i * 0.15}s`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                color:
                  state === "done"
                    ? "var(--success)"
                    : state === "current"
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                fontSize: 14,
                textDecoration: state === "done" ? "line-through" : "none",
                paddingLeft: state === "pending" ? 24 : 0,
              }}
            >
              {state === "done" && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {state === "current" && (
                <svg className="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="var(--accent)" strokeWidth="2" strokeDasharray="20 12" />
                </svg>
              )}
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
