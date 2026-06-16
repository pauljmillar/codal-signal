"use client";
import { useState } from "react";

const INDUSTRIES = [
  "Healthcare",
  "Retail & Consumer Goods",
  "Manufacturing",
  "Financial Services",
  "Legal & Insurance",
  "Life Sciences",
  "Automotive & Logistics",
  "Other",
];
const SIZES = [
  "Mid-market ($100M–$500M revenue)",
  "Large Enterprise ($500M–$2B)",
  "Fortune 500",
];
const CHALLENGES = [
  "Application Modernization",
  "eCommerce Platform",
  "AI/ML Implementation",
  "Data Pipeline & Analytics",
  "Customer Experience Overhaul",
  "Cloud Migration",
  "Custom Platform Build",
];
const TIMELINES = ["<3 months", "3–6 months", "6–12 months", "12+ months"];
const BUDGETS = ["<$500k", "$500k–$1M", "$1M–$2M", "$2M+"];
const DELIVERY = ["Inbound RFP", "Outbound", "Referral", "Existing client expansion"];
const FLAGS = [
  "Regulated industry (HIPAA/SOC2/PCI)",
  "Legacy system dependencies",
  "Multi-system integration required",
  "International/multi-currency",
  "Real-time requirements",
  "AI/ML in scope",
];

export type ScopeInput = {
  industry: string;
  size: string;
  challenges: string[];
  currentStack: string;
  timeline: string;
  budget: string;
  deliveryContext: string;
  flags: string[];
  hasInternalTeam: string;
};

export default function ScopeForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: ScopeInput) => void;
  loading: boolean;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ScopeInput>({
    industry: "Healthcare",
    size: SIZES[1],
    challenges: [],
    currentStack: "",
    timeline: "6–12 months",
    budget: "$1M–$2M",
    deliveryContext: "Inbound RFP",
    flags: [],
    hasInternalTeam: "Partial",
  });

  const toggle = (key: "challenges" | "flags", v: string) => {
    setData((d) => {
      const set = new Set(d[key]);
      if (set.has(v)) set.delete(v);
      else {
        if (key === "challenges" && set.size >= 2) return d;
        set.add(v);
      }
      return { ...d, [key]: Array.from(set) };
    });
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 100,
              background: s <= step ? "var(--accent)" : "var(--border)",
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>
      <div className="mb-2" style={{ color: "var(--text-muted)", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Step {step} of 3
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Deal Context</h3>
          <div>
            <label className="label">Client Industry</label>
            <select className="select" value={data.industry} onChange={(e) => setData({ ...data, industry: e.target.value })}>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Client Size</label>
            <select className="select" value={data.size} onChange={(e) => setData({ ...data, size: e.target.value })}>
              {SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Primary Challenge (pick up to 2)</label>
            <div className="flex gap-2 flex-wrap">
              {CHALLENGES.map((c) => {
                const active = data.challenges.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggle("challenges", c)}
                    className="pill"
                    style={{
                      cursor: "pointer",
                      background: active ? "var(--accent-dim)" : "var(--bg-soft)",
                      color: active ? "var(--accent-light)" : "var(--text-secondary)",
                      border: `1px solid ${active ? "rgba(53,53,232,0.4)" : "var(--border)"}`,
                      padding: "6px 12px",
                    }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="label">Current Tech Stack</label>
            <textarea
              className="textarea"
              rows={3}
              placeholder="Describe what they're running today (e.g., Magento 2 on AWS, Salesforce + custom Node middleware)"
              value={data.currentStack}
              onChange={(e) => setData({ ...data, currentStack: e.target.value })}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Estimated Timeline</label>
              <select className="select" value={data.timeline} onChange={(e) => setData({ ...data, timeline: e.target.value })}>
                {TIMELINES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Budget Signal</label>
              <select className="select" value={data.budget} onChange={(e) => setData({ ...data, budget: e.target.value })}>
                {BUDGETS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="btn-primary" onClick={() => setStep(2)}>Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Delivery Context</h3>
          <div>
            <label className="label">How did this come in?</label>
            <select className="select" value={data.deliveryContext} onChange={(e) => setData({ ...data, deliveryContext: e.target.value })}>
              {DELIVERY.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Complexity Flags</label>
            <div className="flex gap-2 flex-wrap">
              {FLAGS.map((f) => {
                const active = data.flags.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggle("flags", f)}
                    className="pill"
                    style={{
                      cursor: "pointer",
                      background: active ? "var(--accent-dim)" : "var(--bg-soft)",
                      color: active ? "var(--accent-light)" : "var(--text-secondary)",
                      border: `1px solid ${active ? "rgba(53,53,232,0.4)" : "var(--border)"}`,
                      padding: "6px 12px",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="label">Internal Engineering Team?</label>
            <select className="select" value={data.hasInternalTeam} onChange={(e) => setData({ ...data, hasInternalTeam: e.target.value })}>
              <option>Yes</option>
              <option>Partial</option>
              <option>No</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button className="btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button className="btn-primary" onClick={() => setStep(3)}>Next</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Review & Generate</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm" style={{ fontSize: 14 }}>
            <Item label="Industry" value={data.industry} />
            <Item label="Client Size" value={data.size} />
            <Item label="Challenges" value={data.challenges.join(", ") || "—"} />
            <Item label="Timeline" value={data.timeline} />
            <Item label="Budget" value={data.budget} />
            <Item label="Delivery" value={data.deliveryContext} />
            <Item label="Internal Team" value={data.hasInternalTeam} />
            <Item label="Flags" value={data.flags.join(", ") || "—"} />
          </div>
          <div>
            <label className="label">Current Stack</label>
            <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {data.currentStack || "—"}
            </div>
          </div>
          <div className="flex justify-between">
            <button className="btn-ghost" onClick={() => setStep(2)}>Back</button>
            <button className="btn-primary" disabled={loading} onClick={() => onSubmit(data)}>
              {loading ? "Generating..." : "Generate Recommendation"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="label" style={{ marginBottom: 2 }}>{label}</div>
      <div>{value}</div>
    </div>
  );
}
