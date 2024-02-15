'use client';

import { Button } from './button';

export const User = ({ username }: { username: string }) => {
  const handleLogout = () => {
    fetch('/api/user/google/logout');
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
