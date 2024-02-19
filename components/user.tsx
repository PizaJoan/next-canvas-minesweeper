'use client';

import { useRouter } from 'next/navigation';

import { Button } from './button';

export const User = ({ username }: { username: string }) => {
  const router = useRouter();

  const handleLogout = () => {
    fetch('/api/user/google/logout').then(() => router.refresh());
  };

  return (
    <div className="flex flex-row items-center justify-center gap-5 md:justify-start">
      <p>
        Hello,{' '}
        <span className="bg-red-40 font-semibold italic">{username}</span>
      </p>
      <Button onClick={handleLogout} customClassNames="px-3 py-2 m-0">
        Logout
      </Button>
    </div>
  );
};
