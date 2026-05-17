import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chaturbo",
  description: "Turn solved AI-agent problems into reusable workflow assets"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
