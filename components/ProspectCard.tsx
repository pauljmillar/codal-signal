"use client";
import { useState } from "react";
import type { Prospect } from "@/lib/prospects-data";
import ScoreRing from "./ScoreRing";
import BriefCard from "./BriefCard";

const STATUSES = ["New", "Contacted", "In Pipeline", "Passed"] as const;

function statusPill(s: string) {
  if (s === "New") return "pill-new";
  if (s === "Contacted") return "pill-contacted";
  if (s === "In Pipeline") return "pill-pipeline";
  return "pill-passed";
}

export default function ProspectCard({
  prospect,
  onStatusChange,
}: {
  prospect: Prospect;
  onStatusChange: (id: string, status: Prospect["status"]) => void;
}) {
  const [open, setOpen] = useState(false);
  const b = prospect.brief;
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <strong style={{ fontSize: 17 }}>{b.company_name}</strong>
            <span className={`pill ${statusPill(prospect.status)}`}>{prospect.status}</span>
          </div>
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="pill pill-neutral">{b.industry}</span>
            <span className="pill pill-neutral">{b.platform}</span>
            <span className="pill pill-capability">{prospect.top_opportunity_tag}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Flagged {prospect.flagged_at}
          </div>
        </div>
        <div className="flex gap-4">
          <ScoreRing value={b.ai_readiness_score} label="AI" size={56} />
          <ScoreRing value={b.llm_visibility_score} label="LLM" size={56} />
        </div>
      </div>
      <div className="flex gap-3 mt-4 items-center flex-wrap">
        <button className="btn-ghost" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide Brief" : "View Brief"}
        </button>
        <select
          className="select"
          style={{ width: "auto", padding: "8px 12px", fontSize: 13 }}
          value={prospect.status}
          onChange={(e) => onStatusChange(prospect.id, e.target.value as any)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      {open && (
        <div className="mt-5">
          <BriefCard brief={b} />
        </div>
      )}
    </div>
  );
}
