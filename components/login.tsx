'use client';

import { useEffect } from 'react';

export const LoginUser = () => {
  useEffect(() => {
    fetch('/api/user/init');
  }, []);

  return <></>;
};
