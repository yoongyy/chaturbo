import type { Metadata } from "next";
import "./globals.css";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

export const metadata: Metadata = {
  title: "Chaturbo Portal",
  description: "Turn solved AI-agent problems into reusable workflow assets"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <AppHeader />
        <div className="min-h-[calc(100vh-64px)]">{children}</div>
        <AppFooter />
      </body>
    </html>
  );
}
