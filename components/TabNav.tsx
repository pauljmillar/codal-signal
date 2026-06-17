"use client";
import Link from "next/link";

export default function TabNav() {
  return (
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
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
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
        style={{ color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}
        className="hidden md:block"
      >
        Built by Paul Millar · VP Engineering candidate
      </div>
    </header>
  );
}
