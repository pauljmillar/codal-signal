import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import TabNav from "@/components/TabNav";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Codal Signal — Prospect Intelligence",
  description: "Prospect intelligence for technical sales.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>
        <TabNav />
        {children}
      </body>
    </html>
  );
}
