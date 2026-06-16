"use client";
import { useState } from "react";
import type { Brief } from "@/lib/types";
import ScoreRing from "./ScoreRing";

function tierClass(t: string) {
  return t === "L" ? "pill-tier-L" : t === "M" ? "pill-tier-M" : "pill-tier-S";
}

export function briefToMarkdown(b: Brief): string {
  const lines = [
    `# ${b.company_name}`,
    `URL: ${b.url}`,
    `Industry: ${b.industry} · Platform: ${b.platform}`,
    "",
    `**AI Readiness:** ${b.ai_readiness_score}/100 — ${b.ai_readiness_rationale}`,
    `**LLM Visibility:** ${b.llm_visibility_score}/100`,
    "",
    `## LLM Visibility`,
    b.llm_visibility_narrative,
    "",
    `## Tech Stack`,
    ...(b.tech_stack_tags || []).map((t) => `- ${t}`),
    b.platform_detail ? `\n${b.platform_detail}` : "",
    "",
    `## Top Friction Opportunities`,
    ...b.friction_opportunities.map(
      (f, i) =>
        `${i + 1}. **${f.area}** (${f.impact}) — ${f.friction}\n   → ${f.ai_intervention} · _${f.codal_capability}_`
    ),
    "",
    `## Competitive AI Gaps`,
    ...(b.competitive_gaps || []).map((g) => `- ${g}`),
    "",
    `## Opportunity Tier: ${b.opportunity_tier}`,
    b.opportunity_rationale,
    "",
    `## Conversation Opener`,
    `> ${b.bd_opener}`,
  ];
  return lines.join("\n");
}

export default function BriefCard({
  brief,
  onSave,
  saved,
}: {
  brief: Brief;
  onSave?: () => void;
  saved?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(briefToMarkdown(brief));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="fadein space-y-5">
      <div className="card">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
              {brief.company_name}
            </h2>
            <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 4 }}>
              {brief.url}
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="pill pill-neutral">{brief.industry}</span>
              <span className="pill pill-neutral">{brief.platform}</span>
              <span className={`pill ${tierClass(brief.opportunity_tier)}`}>
                Tier {brief.opportunity_tier}
              </span>
            </div>
          </div>
          <div className="flex gap-6">
            <ScoreRing value={brief.ai_readiness_score} label="AI Ready" />
            <ScoreRing value={brief.llm_visibility_score} label="LLM Vis" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-heading">Tech Stack</div>
        <div className="flex gap-2 flex-wrap">
          {(brief.tech_stack_tags || []).map((t, i) => (
            <span key={i} className="pill pill-neutral font-mono" style={{ textTransform: "none" }}>
              {t}
            </span>
          ))}
        </div>
        {brief.platform_detail && (
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 14, lineHeight: 1.6 }}>
            {brief.platform_detail}
          </p>
        )}
      </div>

      <div className="card">
        <div className="section-heading">LLM Visibility</div>
        <p style={{ fontSize: 15, lineHeight: 1.6 }}>{brief.llm_visibility_narrative}</p>
      </div>

      <div className="card">
        <div className="section-heading">Top 3 Friction Opportunities</div>
        <div className="grid md:grid-cols-3 gap-4">
          {brief.friction_opportunities.map((f, i) => (
            <div
              key={i}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 16,
                background: "var(--bg-soft)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <strong style={{ fontSize: 14 }}>{f.area}</strong>
                <span
                  className="pill"
                  style={{
                    background:
                      f.impact === "High"
                        ? "rgba(239,68,68,0.12)"
                        : f.impact === "Medium"
                        ? "var(--warning-dim)"
                        : "var(--bg-soft)",
                    color:
                      f.impact === "High"
                        ? "#FCA5A5"
                        : f.impact === "Medium"
                        ? "#FCD34D"
                        : "var(--text-secondary)",
                  }}
                >
                  {f.impact}
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8, lineHeight: 1.5 }}>
                {f.friction}
              </p>
              <p style={{ fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>
                → {f.ai_intervention}
              </p>
              <span className="pill pill-capability">{f.codal_capability}</span>
            </div>
          ))}
        </div>
      </div>

      {brief.competitive_gaps?.length > 0 && (
        <div className="card">
          <div className="section-heading">Competitive AI Gap</div>
          <ul style={{ listStyle: "disc", paddingLeft: 20, fontSize: 14, lineHeight: 1.8 }}>
            {brief.competitive_gaps.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <div className="section-heading">Opportunity Tier</div>
        <div className="flex items-center gap-3">
          <span className={`pill ${tierClass(brief.opportunity_tier)}`} style={{ fontSize: 14 }}>
            Tier {brief.opportunity_tier}
          </span>
          <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {brief.opportunity_rationale}
          </span>
        </div>
      </div>

      <div className="card">
        <div className="section-heading">Conversation Opener</div>
        <div className="opener-callout">{brief.bd_opener}</div>
      </div>

      <div className="flex gap-3 no-print">
        <button className="btn-primary" onClick={copy}>
          {copied ? "Copied ✓" : "Copy Brief"}
        </button>
        {onSave && (
          <button className="btn-ghost" onClick={onSave} disabled={saved}>
            {saved ? "Saved to Prospects ✓" : "Save to Prospects"}
          </button>
        )}
      </div>
    </div>
  );
}
