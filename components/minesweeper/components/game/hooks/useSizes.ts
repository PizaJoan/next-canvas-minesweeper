import { CELL_MULTIPLIER, CELL_SIZE } from '@/components/minesweeper/constants';
import { Difficulty } from '@/components/minesweeper/types';
import { useIsSmallDevice } from '@/components/minesweeper/components/game/hooks/useIsSmallDevice';
import { useEffect, useMemo, useState } from 'react';

export const useSizes = ({
  rows,
  cols,
  difficulty,
}: {
  rows: number;
  cols: number;
  difficulty: Difficulty;
}) => {
  const { isSmallDevice, size } = useIsSmallDevice();

  const multiplier = useMemo(
    () => (isSmallDevice ? 1 : CELL_MULTIPLIER[difficulty]),
    [difficulty, isSmallDevice],
  );

  const drawCellSize = useMemo(
    () =>
      isSmallDevice ? Math.floor((size - 20) / cols) : CELL_SIZE * multiplier,
    [multiplier, isSmallDevice, size, cols],
  );

  const canvasWidth = useMemo(
    () => Math.round(drawCellSize * cols),
    [cols, drawCellSize],
  );
  const canvasHeight = useMemo(
    () => Math.round(drawCellSize * rows),
    [rows, drawCellSize],
  );

  return { multiplier, drawCellSize, canvasWidth, canvasHeight };
};
