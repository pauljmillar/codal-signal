"use client";
import { useState } from "react";
import BriefCard from "@/components/BriefCard";
import LoadingSteps from "@/components/LoadingSteps";
import type { Brief } from "@/lib/types";

const INDUSTRIES = ["", "Healthcare", "Retail & Consumer Goods", "Manufacturing", "Financial Services", "Legal & Insurance", "Life Sciences", "Automotive & Logistics", "Other"];
const SIZES = ["", "Startup", "Mid-market", "Enterprise"];

export default function AnalyzePage() {
  const [url, setUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [partial, setPartial] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPartial(null);
    setSaved(false);
    if (!/^https?:\/\/.+/.test(url)) {
      setError("Please enter a valid URL starting with https://");
      return;
    }
    setLoading(true);
    setBrief(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, industry, size }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Analysis failed");
      } else {
        setBrief(json.brief);
        if (json.partial) setPartial(json.partial);
      }
    } catch (err: any) {
      setError(err?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    if (!brief) return;
    const stored = JSON.parse(localStorage.getItem("savedProspects") || "[]");
    stored.unshift({
      id: `saved-${Date.now()}`,
      status: "New",
      top_opportunity_tag: brief.friction_opportunities[0]?.codal_capability || "Opportunity",
      flagged_at: "Just now",
      brief,
    });
    localStorage.setItem("savedProspects", JSON.stringify(stored));
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>Analyze a prospect</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: 15 }}>
          Enter a URL to generate a BD brief — tech stack, AI readiness, LLM visibility, and a conversation opener.
        </p>
      </div>

      <form onSubmit={submit} className="card space-y-4">
        <div>
          <label className="label">Prospect URL</label>
          <input
            className="input"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Industry (optional)</label>
            <select className="select" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i || "Auto-detect"}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Company Size (optional)</label>
            <select className="select" value={size} onChange={(e) => setSize(e.target.value)}>
              {SIZES.map((s) => <option key={s} value={s}>{s || "Unknown"}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="btn-primary" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
        {error && (
          <div style={{ color: "var(--error)", fontSize: 14, padding: "8px 12px", background: "var(--error-dim)", borderRadius: 8 }}>
            {error}
          </div>
        )}
      </form>

      {loading && <LoadingSteps />}

      {partial && (
        <div className="card" style={{ borderColor: "rgba(245,158,11,0.4)", background: "var(--warning-dim)" }}>
          <strong style={{ color: "var(--warning)" }}>Partial scan:</strong>{" "}
          <span style={{ color: "var(--text-secondary)" }}>{partial}</span>
        </div>
      )}

      {brief && <BriefCard brief={brief} onSave={save} saved={saved} />}
    </div>
  );
}
