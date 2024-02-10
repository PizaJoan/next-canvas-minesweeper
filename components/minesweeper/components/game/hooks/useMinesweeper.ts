import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { GameContext } from '../../../context/gameContext';

import {
  initialize,
  handleOnClickCurrying,
  handleOnContextMenuCurrying,
  handleOnHoverCurrying,
  handleOnMouseOutCurrying,
} from '../core/minesweeper';

import { Cell } from '../../../types';
import { CELL_MULTIPLIER, CELL_SIZE } from '../../../constants';

export const useMineSweeper = () => {
  const { cols, rows, mines, difficulty, board } = useContext(GameContext);

  const boardRef = useRef<Cell[][]>();
  const prevHoveredRef = useRef<[number, number]>([-1, -1]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>();

  const [visited, setVisited] = useState<Cell[]>([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [flags, setFlags] = useState(mines);
  const flagsRef = useRef(flags);

  const visitedCellsToWin = useMemo(
    () => cols * rows - mines,
    [cols, rows, mines],
  );

  const multiplier = useMemo(() => CELL_MULTIPLIER[difficulty], [difficulty]);
  const drawCellSize = useMemo(() => CELL_SIZE * multiplier, [multiplier]);

  const canvasWidth = useMemo(
    () => Math.round(CELL_SIZE * cols * multiplier),
    [cols, multiplier],
  );
  const canvasHeight = useMemo(
    () => Math.round(CELL_SIZE * rows * multiplier),
    [rows, multiplier],
  );

  const handleUpdateVisited = useCallback((...visitedCels: Cell[]) => {
    setVisited((prevVisited) => {
      const updatedVisited = [...prevVisited];
      updatedVisited?.push(...visitedCels);

      return updatedVisited;
    });
  }, []);

  const useFlag = useCallback((used: boolean = false) => {
    setFlags((prev) => (prev > 0 ? (used ? prev + 1 : prev - 1) : prev));
  }, []);

  const win = useCallback(() => setWon(true), []);
  const lose = useCallback(() => setLost(true), []);

  const handleReset = useCallback(() => {
    setWon(false);
    setLost(false);
  }, []);

  useEffect(() => {
    if (canvasRef.current && !(won || lost)) {
      // Reset original state
      setFlags(mines);
      setVisited([]);

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
        useFlag,
      );

      canvas.addEventListener('mousemove', handleOnHover);
      canvas.addEventListener('mouseout', handleOnMouseOut);
      canvas.addEventListener('click', handleClick);
      canvas.addEventListener('contextmenu', handleOnContextMenu);

      return () => {
        canvas.removeEventListener('mousemove', handleOnHover);
        canvas.removeEventListener('mouseout', handleOnMouseOut);
        canvas.removeEventListener('click', handleClick);
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
    useFlag,
    handleUpdateVisited,
  ]);

  useEffect(() => {
    flagsRef.current = flags;
  }, [flags]);

  useEffect(() => {
    const foundBomb = visited.find((cell) => isNaN(cell.num));
    if (foundBomb) return lose();

    if (visitedCellsToWin === visited.length) return win();
  }, [visited, visitedCellsToWin, win, lose]);

  // Force reset game when updates the context/changes difficulty
  useEffect(() => {
    handleReset();
  }, [cols, rows, handleReset]);

  return {
    canvasRef,
    width: canvasWidth,
    height: canvasHeight,
    remainingFlags: flags,
    won,
    lost,
    reset: handleReset,
  };
};
