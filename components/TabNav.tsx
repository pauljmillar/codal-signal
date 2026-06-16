"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/analyze", label: "Analyze" },
  { href: "/prospects", label: "Prospects" },
  { href: "/scope", label: "Scope" },
];

export default function TabNav() {
  const pathname = usePathname();
  return (
    <>
      <header
        className="no-print"
        style={{
          background: "rgba(7, 7, 42, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
          height: 56,
          padding: "0 24px",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/analyze" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            Codal
          </span>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 100,
              background: "var(--accent)",
              boxShadow: "0 0 12px var(--accent)",
            }}
          />
          <span
            style={{
              fontWeight: 600,
              fontSize: 15,
              color: "var(--accent-light)",
              letterSpacing: "0.02em",
            }}
          >
            Signal
          </span>
        </Link>
        <div
          style={{
            color: "var(--text-muted)",
            fontSize: 12,
            letterSpacing: "0.04em",
          }}
        >
          Built by Paul Millar · VP Engineering candidate
        </div>
      </header>
      <nav
        className="no-print"
        style={{
          background: "rgba(7, 7, 42, 0.6)",
          borderBottom: "1px solid var(--border)",
          padding: "0 24px",
          position: "fixed",
          top: 56,
          width: "100%",
          zIndex: 40,
          display: "flex",
        }}
      >
        {TABS.map((t) => {
          const active = pathname?.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              style={{
                padding: "14px 0",
                marginRight: 32,
                fontSize: 14,
                fontWeight: 500,
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                borderBottom: `2px solid ${active ? "var(--accent)" : "transparent"}`,
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
