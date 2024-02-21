import { useEffect, useState } from 'react';

import { MIN_DESKTOP_WIDTH } from '@/constants/window-size';

export const useIsSmallDevice = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const [size, setSize] = useState(0);

  // For some reason NextJS complains when we access window outside of a useEffect...
  useEffect(() => {
    setIsSmallDevice(window.screen.width < MIN_DESKTOP_WIDTH);
    setSize(window.screen.width);
  }, []);

  return { isSmallDevice, size };
};
