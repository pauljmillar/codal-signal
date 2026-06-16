"use client";
import { useState } from "react";
import ScopeForm, { type ScopeInput } from "@/components/ScopeForm";
import ScopeOutputView from "@/components/ScopeOutput";
import type { ScopeOutput } from "@/lib/types";

export default function ScopePage() {
  const [output, setOutput] = useState<ScopeOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: ScopeInput) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) setError(json.error || "Generation failed");
      else setOutput(json.scope);
    } catch (e: any) {
      setError(e?.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="no-print">
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>Scope</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: 15 }}>
          Convert raw deal context into a structured technical recommendation for finalist meetings.
        </p>
      </div>
      {!output && <div className="no-print"><ScopeForm onSubmit={submit} loading={loading} /></div>}
      {error && (
        <div className="card" style={{ borderColor: "rgba(239,68,68,0.4)", color: "var(--error)" }}>
          {error}
        </div>
      )}
      {output && (
        <>
          <ScopeOutputView data={output} />
          <div className="no-print">
            <button className="btn-ghost" onClick={() => setOutput(null)}>← Start a new scope</button>
          </div>
        </>
      )}
    </div>
  );
}
