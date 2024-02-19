'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { User } from './user';
import { GoogleLogin } from './google-login/google-login';

export const Navbar = ({ username }: { username?: string }) => {
  const path = usePathname();

  return (
    <header className="justify-content-center flex flex-col gap-5 pt-10 md:grid md:grid-cols-3">
      <div className="flex flex-row items-center justify-center gap-5 md:col-start-2">
        <Link href="/" className={path === '/' ? 'font-semibold' : ''}>
          Game
        </Link>
        <Link
          href="/leaderboard"
          className={path.includes('leaderboard') ? 'font-semibold' : ''}
        >
          Leaderboard
        </Link>
      </div>
      {username ? <User username={username} /> : <GoogleLogin />}
    </header>
  );
};
