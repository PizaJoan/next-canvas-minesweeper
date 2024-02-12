'use client';

import { useEffect } from 'react';
import { initUser } from './minesweeper/components/game/lib/requests';

export const LoginUser = () => {
  useEffect(() => {
    initUser();
  }, []);

  return <></>;
};
