import type { Metadata } from "next";
import Link from "next/link";
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
  title: "Chaturbo | AI Employees for Malaysian SMEs",
  description: "Done-for-you AI agents for Malaysian SMEs that reply customers, capture leads, prepare quotations, and automate repetitive admin work.",
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
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/90 px-4 py-3 shadow-[0_-12px_30px_rgba(18,46,54,0.12)] backdrop-blur-md md:hidden">
          <div className="mx-auto max-w-7xl">
            <Link href="/apply" className="block rounded-2xl bg-ink px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-ink/20">
              Apply Free Setup
            </Link>
          </div>
        </div>
        <AppFooter />
      </body>
    </html>
  );
}
