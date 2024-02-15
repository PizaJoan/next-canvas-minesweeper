'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { User } from './user';
import { GoogleLogin } from './google-login/google-login';

export const Navbar = ({ username }: { username?: string }) => {
  const path = usePathname();

  return (
    <header className="justify-content-center grid grid-cols-3 gap-5 pt-10">
      <div className="col-start-2 flex flex-row items-center justify-center gap-5">
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
