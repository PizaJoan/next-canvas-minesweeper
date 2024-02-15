'use server';

import Link from 'next/link';
import Script from 'next/script';
import { cookies } from 'next/headers';

import { User } from './user';
import { GoogleLogin } from './google-login/google-login';

// TODO: add is active condition and some styles to make it look cool
export const Navbar = () => {
  const username = cookies().get('username')?.value;

  return (
    <header className="justify-content-center grid grid-cols-3 gap-5 pt-10">
      <div className="col-start-2 flex flex-row items-center justify-center gap-5">
        <Link href="/">Game</Link>
        <Link href="/leaderboard">Leaderboard</Link>
      </div>
      {username ? <User username={username} /> : <GoogleLogin />}
    </header>
  );
};
