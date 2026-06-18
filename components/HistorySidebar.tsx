"use client";
import { useState } from "react";
import type { HistoryEntry } from "@/lib/history";
import { relativeTime } from "@/lib/history";

export default function HistorySidebar({
  entries,
  activeId,
  open,
  onToggle,
  onSelect,
  onNew,
  onDelete,
  onClear,
}: {
  entries: HistoryEntry[];
  activeId: string | null;
  open: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <>
      <aside
        className="no-print"
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 72,
          left: 0,
          bottom: 0,
          width: 260,
          background: "#FFFFFF",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          zIndex: 30,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease",
          visibility: open ? "visible" : "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 12px 12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <button
            onClick={onNew}
            style={{
              flex: 1,
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
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.background = "var(--text-primary)")
            }
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            New scan
          </button>
          <button
            onClick={onToggle}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-soft)";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "var(--error)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")
              }
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
                        (ev.currentTarget as HTMLButtonElement).style.background =
                          "rgba(220,38,38,0.08)";
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

      {/* Expand button — visible only when sidebar is collapsed */}
      {!open && (
        <button
          onClick={onToggle}
          aria-label="Open sidebar"
          title="Open sidebar"
          className="no-print"
          style={{
            position: "fixed",
            top: 84,
            left: 16,
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "#FFFFFF",
            border: "1px solid var(--border-strong)",
            color: "var(--text-primary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 35,
            boxShadow: "0 2px 8px rgba(11,17,31,0.06)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-soft)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#FFFFFF";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </>
  );
}

function stripUrl(u: string): string {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
}
