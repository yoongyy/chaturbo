import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Chaturbo Lead Rescue",
  description: "Missed-call rescue for US contractors. Text back leads in seconds, qualify jobs, and book more work from roofing, HVAC, plumbing, and other local service businesses.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
      <body className="min-h-screen bg-sand pb-24 text-ink antialiased md:pb-0">
        <AppHeader />
        <div className="min-h-[calc(100vh-64px)]">{children}</div>
        <AppFooter />
      </body>
    </html>
  );
}
