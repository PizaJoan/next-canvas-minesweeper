import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "jpizaf's Minesweeper App",
  description: "Simple minesweeper app with auth and leaderboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="min-h-screen px-24 py-16">{children}</main>
      </body>
    </html>
  );
}
