import { useEffect, useMemo, useState } from 'react';

import { MIN_DESKTOP_WIDTH } from '@/constants/window-size';

export const useIsSmallDevice = () => {
  const isSmallDevice = useMemo(
    () => window.innerWidth < MIN_DESKTOP_WIDTH,
    [],
  );
  const size = useMemo(() => window.innerWidth, []);

  return { isSmallDevice, size };
};
