import { useEffect, useMemo, useState } from 'react';

import { MIN_DESKTOP_WIDTH } from '@/constants/window-size';

export const useIsSmallDevice = () => {
  const isSmallDevice = useMemo(
    () => window.screen.width < MIN_DESKTOP_WIDTH,
    [],
  );
  const size = useMemo(() => window.screen.width, []);

  return { isSmallDevice, size };
};
