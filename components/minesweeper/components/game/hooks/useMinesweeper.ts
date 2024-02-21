import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { Cell } from '../../../types';

import { GameContext } from '../../../context/gameContext';
import { useSizes } from './useSizes';

import {
  initialize,
  handleOnClickCurrying,
  handleOnContextMenuCurrying,
  handleOnHoverCurrying,
  handleOnMouseOutCurrying,
} from '../core/minesweeper';

import { BOMB } from '../../../constants';
import { useIsSmallDevice } from './useIsSmallDevice';

const emptyArray: Cell[] = [];

export const useMineSweeper = () => {
  const { cols, rows, mines, difficulty, board, reset } =
    useContext(GameContext);

  const { canvasHeight, canvasWidth, drawCellSize, multiplier } = useSizes({
    rows,
    cols,
    difficulty,
  });

  const boardRef = useRef<Cell[][]>();
  const prevHoveredRef = useRef<[number, number]>([-1, -1]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>();

  const [visited, setVisited] = useState<Cell[]>(emptyArray);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [flags, setFlags] = useState(mines);
  const flagsRef = useRef(flags);

  // Mobile Stuff
  const [isDigMode, setIsDigMode] = useState(true);
  const isDigModeRef = useRef(isDigMode);

  const visitedCellsToWin = useMemo(
    () => cols * rows - mines,
    [cols, rows, mines],
  );

  const handleUpdateVisited = useCallback((...visitedCels: Cell[]) => {
    const flagsCleared = visitedCels.filter((cell) => cell.isFlag);

    if (flagsCleared.length >= 1)
      setFlags((prevFlags) => prevFlags + flagsCleared.length);

    setVisited((prevVisited) => {
      const updatedVisited = [...prevVisited];
      updatedVisited?.push(...visitedCels);

      return updatedVisited;
    });
  }, []);

  const handleUseFlag = useCallback((used: boolean = false) => {
    setFlags((prev) => (prev > 0 ? (used ? prev + 1 : prev - 1) : prev));
  }, []);

  const win = useCallback(() => setWon(true), []);
  const lose = useCallback(() => setLost(true), []);

  const handleReset = useCallback(() => {
    setWon(false);
    setLost(false);
  }, []);

  const handleClickReset = useCallback(() => {
    handleReset();
    reset?.({ rows, cols, difficulty });
  }, [handleReset, reset, rows, cols, difficulty]);

  const setDigMode = useCallback(() => setIsDigMode(true), []);
  const setFlagMode = useCallback(() => setIsDigMode(false), []);

  useEffect(() => {
    if (canvasRef.current && !(won || lost)) {
      const canvas = canvasRef.current;

      ctx.current = canvas.getContext('2d');
      ctx.current!.font = `${drawCellSize}px bold serif`;
      boardRef.current = initialize(
        ctx.current,
        board,
        drawCellSize,
        cols,
        rows,
      );

      const handleOnHover = handleOnHoverCurrying(
        boardRef.current,
        ctx.current,
        drawCellSize,
        prevHoveredRef,
      );
      const handleOnMouseOut = handleOnMouseOutCurrying(
        boardRef.current,
        ctx.current,
        drawCellSize,
        prevHoveredRef,
      );
      const handleClick = handleOnClickCurrying(
        boardRef.current,
        ctx.current,
        drawCellSize,
        handleUpdateVisited,
      );
      const handleOnContextMenu = handleOnContextMenuCurrying(
        boardRef.current,
        ctx.current,
        drawCellSize,
        flagsRef,
        multiplier,
        handleUseFlag,
      );

      const finalOnClickEvent = function (ev: MouseEvent) {
        if (isDigModeRef.current) handleClick(ev);
        else handleOnContextMenu(ev);
      };

      canvas.addEventListener('mousemove', handleOnHover);
      canvas.addEventListener('mouseout', handleOnMouseOut);
      canvas.addEventListener('click', finalOnClickEvent);
      canvas.addEventListener('contextmenu', handleOnContextMenu);

      return () => {
        canvas.removeEventListener('mousemove', handleOnHover);
        canvas.removeEventListener('mouseout', handleOnMouseOut);
        canvas.removeEventListener('click', finalOnClickEvent);
        canvas.removeEventListener('contextmenu', handleOnContextMenu);
      };
    }
  }, [
    multiplier,
    won,
    lost,
    mines,
    drawCellSize,
    cols,
    rows,
    board,
    handleUseFlag,
    handleUpdateVisited,
  ]);

  useEffect(() => {
    flagsRef.current = flags;
  }, [flags]);

  useEffect(() => {
    isDigModeRef.current = isDigMode;
  }, [isDigMode]);

  useEffect(() => {
    const foundBomb = visited.find((cell) => cell.num === BOMB);
    if (foundBomb) return lose();

    if (visitedCellsToWin === visited.length) return win();
  }, [visited, visitedCellsToWin, win, lose]);

  // Force reset game when updates the context/changes difficulty
  useEffect(() => {
    handleReset();
    setFlags(mines);
    setVisited(emptyArray);
  }, [board, mines, handleReset]);

  return {
    canvasRef,
    width: canvasWidth,
    height: canvasHeight,
    remainingFlags: flags,
    won,
    lost,
    reset: handleClickReset,
    isDigMode,
    setDigMode,
    setFlagMode,
  };
};
