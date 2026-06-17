"use client";
import { useState } from "react";
import BriefCard from "@/components/BriefCard";
import LoadingSteps from "@/components/LoadingSteps";
import type { Brief } from "@/lib/types";

const SAMPLES: { label: string; url: string }[] = [
  { label: "Nike", url: "https://www.nike.com" },
  { label: "Walgreens", url: "https://www.walgreens.com" },
  { label: "John Deere", url: "https://www.deere.com" },
  { label: "Sephora", url: "https://www.sephora.com" },
  { label: "REI", url: "https://www.rei.com" },
  { label: "Wayfair", url: "https://www.wayfair.com" },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [partial, setPartial] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setPartial(null);
    setBrief(null);
    const trimmed = url.trim();
    const normalized = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
    if (!/^https?:\/\/.+\..+/.test(normalized)) {
      setError("Please enter a valid URL.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalized }),
      });
      const json = await res.json();
      if (!res.ok) setError(json.error || "Analysis failed");
      else {
        setBrief(json.brief);
        if (json.partial) setPartial(json.partial);
      }
    } catch (err: any) {
      setError(err?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setBrief(null);
    setError(null);
    setPartial(null);
    setUrl("");
  };

  // Hero view — input + samples, centered
  if (!brief && !loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 140px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 16px",
        }}
      >
        <h1
          style={{
            fontSize: 44,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Where should we look?
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: 17,
            marginTop: 14,
            marginBottom: 36,
            maxWidth: 540,
          }}
        >
          Enter a prospect URL and Signal generates a BD brief — tech stack, AI readiness, LLM
          visibility, and a cold-outreach opener.
        </p>

        <form onSubmit={submit} style={{ width: "100%", maxWidth: 680 }}>
          <div
            style={{
              position: "relative",
              background: "#FFFFFF",
              border: "1px solid var(--border-strong)",
              borderRadius: 18,
              boxShadow: "0 8px 32px rgba(11,17,31,0.06)",
              padding: "14px 60px 14px 20px",
              display: "flex",
              alignItems: "center",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
          >
            <input
              type="text"
              autoFocus
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: "inherit",
                fontSize: 17,
                color: "var(--text-primary)",
                padding: "6px 0",
              }}
            />
            <button
              type="submit"
              aria-label="Analyze"
              disabled={!url.trim()}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                width: 40,
                height: 40,
                borderRadius: 12,
                border: "none",
                background: url.trim() ? "var(--text-primary)" : "var(--border-strong)",
                color: "#FFFFFF",
                cursor: url.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s, transform 0.1s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </form>

        <div
          style={{
            marginTop: 22,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 680,
          }}
        >
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: 12,
              alignSelf: "center",
              marginRight: 6,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Try
          </span>
          {SAMPLES.map((s) => (
            <button
              key={s.url}
              type="button"
              onClick={() => setUrl(s.url)}
              style={{
                background: "#FFFFFF",
                border: "1px solid var(--border-strong)",
                borderRadius: 999,
                padding: "7px 14px",
                fontFamily: "inherit",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-primary)",
                cursor: "pointer",
                transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-primary)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-soft)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
                (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF";
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {error && (
          <div
            style={{
              marginTop: 22,
              color: "var(--error)",
              fontSize: 14,
              padding: "10px 14px",
              background: "var(--error-dim)",
              borderRadius: 10,
            }}
          >
            {error}
          </div>
        )}
      </div>
    );
  }

  // Loading & result view
  return (
    <div className="space-y-6" style={{ paddingTop: 56 }}>
      <div className="flex items-center justify-between flex-wrap gap-3 no-print">
        <button className="btn-ghost" onClick={reset}>← New analysis</button>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{url}</div>
      </div>
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 24 }}>
          <LoadingSteps />
        </div>
      )}
      {partial && (
        <div
          className="card"
          style={{ borderColor: "rgba(217,119,6,0.4)", background: "var(--warning-dim)" }}
        >
          <strong style={{ color: "var(--warning)" }}>Partial scan:</strong>{" "}
          <span style={{ color: "var(--text-secondary)" }}>{partial}</span>
        </div>
      )}
      {brief && <BriefCard brief={brief} />}
    </div>
  );
}
