'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { initUser } from './minesweeper/components/game/lib/requests';

export const LoginUser = () => {
  const router = useRouter();

  useEffect(() => {
    initUser().then(() => router.refresh());
  }, [router]);

  return <></>;
};
