"use client";
import type { ScopeOutput } from "@/lib/types";

export default function ScopeOutputView({ data }: { data: ScopeOutput }) {
  return (
    <div className="space-y-5 fadein">
      <div className="flex justify-end no-print">
        <button className="btn-ghost" onClick={() => window.print()}>Export as PDF</button>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-5">
          <div className="card">
            <div className="section-heading">Recommended Architecture</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
              {data.architecture_recommendation.summary}
            </p>
            <div className="label">Key Components</div>
            <ul style={{ listStyle: "disc", paddingLeft: 20, fontSize: 14, lineHeight: 1.7 }}>
              {data.architecture_recommendation.key_components.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>
          </div>
          <div className="card">
            <div className="section-heading">Suggested Team Composition</div>
            <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                  <th style={{ padding: "8px 4px", color: "var(--text-secondary)", fontWeight: 600 }}>Role</th>
                  <th style={{ padding: "8px 4px", color: "var(--text-secondary)", fontWeight: 600 }}>Hub</th>
                  <th style={{ padding: "8px 4px", color: "var(--text-secondary)", fontWeight: 600, textAlign: "right" }}>Count</th>
                </tr>
              </thead>
              <tbody>
                {data.team_composition.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 4px" }}>{r.role}</td>
                    <td style={{ padding: "10px 4px", color: "var(--text-secondary)" }}>{r.hub}</td>
                    <td style={{ padding: "10px 4px", textAlign: "right" }}>{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="section-heading">Timeline</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {data.timeline_weeks.min}–{data.timeline_weeks.max} weeks
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                {data.timeline_weeks.note}
              </div>
            </div>
            <div className="card">
              <div className="section-heading">Engagement</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{data.estimated_engagement}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                Initial delivery estimate
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="card">
            <div className="section-heading">Risk Flags</div>
            <div className="space-y-3">
              {data.risk_flags.map((r, i) => (
                <div key={i} style={{ borderLeft: "3px solid var(--warning)", paddingLeft: 12 }}>
                  <strong style={{ fontSize: 14 }}>{r.risk}</strong>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, lineHeight: 1.5 }}>
                    Mitigation: {r.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="section-heading">Codal Capabilities to Lead With</div>
            <div className="flex gap-2 flex-wrap">
              {data.codal_capabilities.map((c, i) => (
                <span key={i} className="pill pill-capability">{c}</span>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="section-heading">Finalist Meeting Talking Points</div>
            <ul style={{ listStyle: "disc", paddingLeft: 20, fontSize: 14, lineHeight: 1.7 }}>
              {data.finalist_talking_points.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
