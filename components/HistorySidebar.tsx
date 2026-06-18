"use client";
import { useState } from "react";
import type { HistoryEntry } from "@/lib/history";
import { relativeTime } from "@/lib/history";

export default function HistorySidebar({
  entries,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClear,
}: {
  entries: HistoryEntry[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <aside
      className="no-print hidden md:flex"
      style={{
        position: "fixed",
        top: 72,
        left: 0,
        bottom: 0,
        width: 260,
        background: "#FFFFFF",
        borderRight: "1px solid var(--border)",
        flexDirection: "column",
        zIndex: 30,
      }}
    >
      <div style={{ padding: "16px 16px 12px 16px" }}>
        <button
          onClick={onNew}
          style={{
            width: "100%",
            background: "var(--text-primary)",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1A2238")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "var(--text-primary)")}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          New scan
        </button>
      </div>

      <div
        style={{
          padding: "0 16px 8px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          History
        </span>
        {entries.length > 0 && (
          <button
            onClick={onClear}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              padding: 0,
              fontFamily: "inherit",
              letterSpacing: "0.04em",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--error)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")}
          >
            Clear
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px 8px" }}>
        {entries.length === 0 ? (
          <div
            style={{
              padding: "20px 12px",
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.5,
            }}
          >
            No scans yet. Try a URL to get started.
          </div>
        ) : (
          entries.map((e) => {
            const active = e.id === activeId;
            const hovered = e.id === hoverId;
            return (
              <div
                key={e.id}
                onMouseEnter={() => setHoverId(e.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => onSelect(e.id)}
                style={{
                  position: "relative",
                  padding: "10px 12px 10px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  marginBottom: 2,
                  background: active ? "var(--bg-soft)" : hovered ? "var(--bg-soft)" : "transparent",
                  borderLeft: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                  transition: "background 0.12s",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    paddingRight: 22,
                  }}
                >
                  {e.company || e.url}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {e.industry || stripUrl(e.url)}
                  </span>
                  <span style={{ flexShrink: 0 }}>{relativeTime(e.createdAt)}</span>
                </div>
                {hovered && (
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      onDelete(e.id);
                    }}
                    aria-label="Delete"
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 6,
                      width: 22,
                      height: 22,
                      borderRadius: 6,
                      border: "none",
                      background: "transparent",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(ev) => {
                      (ev.currentTarget as HTMLButtonElement).style.color = "var(--error)";
                      (ev.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.08)";
                    }}
                    onMouseLeave={(ev) => {
                      (ev.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                      (ev.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

function stripUrl(u: string): string {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
}
