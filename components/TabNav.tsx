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
          background: "#FFFFFF",
          borderBottom: "1px solid var(--border)",
          height: 72,
          padding: "0 32px",
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/analyze" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          {/* Codal logo (dark) */}
          <img
            src="https://codal.com/wp-content/uploads/2025/10/logo-header.svg"
            alt="Codal"
            style={{ height: 22, display: "block" }}
          />
          <span
            style={{
              display: "inline-block",
              width: 1,
              height: 22,
              background: "var(--border-strong)",
              margin: "0 4px",
            }}
          />
          <span
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 500,
              fontSize: 16,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Signal
          </span>
        </Link>
        <div
          style={{
            color: "var(--text-secondary)",
            fontSize: 13,
            fontWeight: 500,
          }}
          className="hidden md:block"
        >
          Built by Paul Millar · VP Engineering candidate
        </div>
      </header>
      <nav
        className="no-print"
        style={{
          background: "#FFFFFF",
          borderBottom: "1px solid var(--border)",
          padding: "0 32px",
          position: "fixed",
          top: 72,
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
                textDecoration: "none",
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
