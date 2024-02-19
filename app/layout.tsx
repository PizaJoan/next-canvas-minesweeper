import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { cookies } from 'next/headers';

import { Navbar } from '@/components/navbar';
import { USERNAME } from '@/constants/cookies-keys';

import './globals.css';

export const metadata: Metadata = {
  title: "jpizaf's Minesweeper App",
  description: 'Simple minesweeper app with auth and leaderboard',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const username = cookies().get(USERNAME)?.value;

  return (
    <html lang="es">
      <body className="bg-slate-950 text-slate-50">
        <Navbar username={username} />
        <main className="min-h-screen px-6 py-10 md:px-24 md:py-16">
          {children}
        </main>
      </body>
    </html>
  );
}
