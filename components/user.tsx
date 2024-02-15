'use client';

import { useRouter } from 'next/navigation';

import { Button } from './button';

export const User = ({ username }: { username: string }) => {
  const router = useRouter();

  const handleLogout = () => {
    fetch('/api/user/google/logout').then(() => router.refresh());
  };

  return (
    <div>
      <p>
        Hello, <span className="font-semibold italic">{username}</span>
      </p>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};
