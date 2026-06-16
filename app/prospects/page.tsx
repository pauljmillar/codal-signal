"use client";
import { useEffect, useMemo, useState } from "react";
import { SEEDED_PROSPECTS, type Prospect } from "@/lib/prospects-data";
import ProspectCard from "@/components/ProspectCard";

const STATUSES = ["New", "Contacted", "In Pipeline", "Passed"] as const;
const TIERS = ["L", "M", "S"] as const;

export default function ProspectsPage() {
  const [list, setList] = useState<Prospect[]>(SEEDED_PROSPECTS);
  const [industryFilter, setIndustryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [tierFilter, setTierFilter] = useState<string>("");

  useEffect(() => {
    try {
      const saved: Prospect[] = JSON.parse(localStorage.getItem("savedProspects") || "[]");
      if (Array.isArray(saved) && saved.length) {
        setList([...saved, ...SEEDED_PROSPECTS]);
      }
    } catch {}
  }, []);

  const industries = useMemo(
    () => Array.from(new Set(list.map((p) => p.brief.industry))),
    [list]
  );

  const filtered = list.filter((p) => {
    if (industryFilter && p.brief.industry !== industryFilter) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (tierFilter && p.brief.opportunity_tier !== tierFilter) return false;
    return true;
  });

  const onStatusChange = (id: string, status: Prospect["status"]) => {
    setList((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const highPriority = list.filter((p) => p.brief.opportunity_tier === "L").length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>Prospects</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 6, fontSize: 15 }}>
            Overnight agent surfaces new opportunities every day.
          </p>
        </div>
        <button
          className="btn-ghost"
          disabled
          title="Coming soon — configure sources, industries, and run schedule."
          style={{ opacity: 0.5, cursor: "not-allowed" }}
        >
          ⚙ Configure Agent
        </button>
      </div>

      <div
        className="card"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, fontSize: 13, color: "var(--text-secondary)" }}
      >
        <span>
          <span style={{ color: "var(--accent-light)", fontWeight: 600 }}>Last agent run:</span> Today at 3:14 AM ·{" "}
          {list.length} companies analyzed · {highPriority} flagged as high-priority
        </span>
      </div>

      <div className="card flex flex-wrap gap-4 items-end">
        <Filter label="Industry" value={industryFilter} onChange={setIndustryFilter} options={["", ...industries]} />
        <Filter label="Status" value={statusFilter} onChange={setStatusFilter} options={["", ...STATUSES]} />
        <Filter label="Tier" value={tierFilter} onChange={setTierFilter} options={["", ...TIERS]} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <ProspectCard key={p.id} prospect={p} onStatusChange={onStatusChange} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ color: "var(--text-muted)", textAlign: "center", padding: 40 }}>
          No prospects match the current filters.
        </div>
      )}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div style={{ minWidth: 160 }}>
      <label className="label">{label}</label>
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "All"}
          </option>
        ))}
      </select>
    </div>
  );
}
