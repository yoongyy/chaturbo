import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Chaturbo Lead Rescue",
  description: "Missed-call recovery and AI lead qualification for US roofing, HVAC, plumbing, and other local service businesses.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="min-h-screen bg-sand pb-24 text-ink antialiased md:pb-0">
        <AppHeader />
        <div className="min-h-[calc(100vh-64px)]">{children}</div>
        <AppFooter />
      </body>
    </html>
  );
}
