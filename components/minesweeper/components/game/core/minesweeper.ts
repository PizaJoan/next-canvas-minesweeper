import { MutableRefObject, RefObject } from 'react';

import { BOMB } from '@/components/minesweeper/constants';

import { Cell, CellColor, Difficulty } from '../../../types';
import { checkBombProximity, getRowAndCol } from '../lib/helpers';
import { playGame, playGameBulk } from '../lib/requests';
import { MIN_DESKTOP_WIDTH } from '@/constants/window-size';

const getCellColor = (num: number): string => {
  switch (num) {
    case 1:
      return '#2563eb';
    case 2:
      return '#16a34a';
    default:
      return '#e11d48';
  }
};

export const mapBoard = (board: number[][]): Cell[][] =>
  board.map((row) => row.map((num) => ({ num, color: CellColor.even })));

export const initialize = (
  ctx: CanvasRenderingContext2D | null,
  board: Cell[][],
  cellSize: number,
  cols: number,
  rows: number,
) => {
  ctx!.fillStyle = CellColor.even;
  ctx?.fillRect(0, 0, cols * cellSize, rows * cellSize);

  ctx?.beginPath();

  for (let i = 0; i < rows; i++) {
    const posY = i * cellSize;

    for (let j = i % 2 === 0 ? 1 : 0; j < cols; j += 2) {
      const posX = j * cellSize;

      board[i][j].color = CellColor.odd;
      ctx?.rect(posX, posY, cellSize, cellSize);
    }
  }

  ctx!.fillStyle = CellColor.odd;
  ctx?.fill();

  return board;
};

export const handleOnHoverCurrying =
  (
    board: Cell[][],
    ctx: CanvasRenderingContext2D | null,
    cellSize: number,
    prevHoveredRef: MutableRefObject<[number, number]>,
  ) =>
  (ev: MouseEvent) => {
    const { x: canvasX, y: canvasY } = (
      ev.target! as HTMLCanvasElement
    ).getBoundingClientRect();

    const [hoverRowIndex, hoverColIndex] = getRowAndCol(
      board.length,
      board[0].length,
      cellSize,
      canvasX,
      canvasY,
      ev.x,
      ev.y,
    );

    const cell = board[hoverRowIndex][hoverColIndex];

    if (!cell.revealed && !cell.isFlag) {
      ctx!.fillStyle = CellColor.highLight;
      ctx?.fillRect(
        hoverColIndex * cellSize,
        hoverRowIndex * cellSize,
        cellSize,
        cellSize,
      );
    }

    if (prevHoveredRef.current) {
      const [prevHoverRow, prevHoverCol] = prevHoveredRef.current;
      const cell = board?.[prevHoverRow]?.[prevHoverCol];

      if (
        cell &&
        !cell.revealed &&
        !cell.isFlag &&
        prevHoverRow !== -1 &&
        prevHoverCol !== -1 &&
        (hoverRowIndex !== prevHoverRow || hoverColIndex !== prevHoverCol)
      ) {
        ctx!.fillStyle = cell.color;
        ctx?.fillRect(
          prevHoverCol * cellSize,
          prevHoverRow * cellSize,
          cellSize,
          cellSize,
        );
      }
    }
    prevHoveredRef.current = [hoverRowIndex, hoverColIndex];
  };

export const handleOnMouseOutCurrying =
  (
    board: Cell[][],
    ctx: CanvasRenderingContext2D | null,
    cellSize: number,
    prevHoveredRef: MutableRefObject<[number, number]>,
  ) =>
  () => {
    if (prevHoveredRef.current) {
      const [prevHoverRow, prevHoverCol] = prevHoveredRef.current;
      const cell = board[prevHoverRow][prevHoverCol];

      if (cell.revealed || cell.isFlag) return;

      ctx!.fillStyle = cell.color;
      ctx?.fillRect(
        prevHoverCol * cellSize,
        prevHoverRow * cellSize,
        cellSize,
        cellSize,
      );
    }
  };

export const handleOnClickCurrying =
  (
    board: Cell[][],
    ctx: CanvasRenderingContext2D | null,
    cellSize: number,
    updateVisited: (...cells: Cell[]) => void,
  ) =>
  (ev: MouseEvent) => {
    const { x: canvasX, y: canvasY } = (
      ev.target! as HTMLCanvasElement
    ).getBoundingClientRect();

    const [clickRow, clickCol] = getRowAndCol(
      board.length,
      board[0].length,
      cellSize,
      canvasX,
      canvasY,
      ev.x,
      ev.y,
    );

    const cell = board[clickRow][clickCol];

    if (!cell.revealed && !cell.isFlag) {
      ctx!.fillStyle = getCellColor(cell.num);

      // Send history to the server
      playGame({ row: clickRow, col: clickCol });

      // BOMB
      if (cell.num === BOMB) {
        ctx?.beginPath();
        ctx?.arc(
          clickCol * cellSize + cellSize / 2,
          clickRow * cellSize + cellSize / 2,
          cellSize / 4,
          0,
          Math.PI * 2,
        );

        ctx?.fill();
        updateVisited(cell);

        // 0 BOMBS NEARBY
      } else {
        if (cell.num === 0) {
          // GET PATH TO CLEAR
          const revealPath = checkBombProximity(board, clickRow, clickCol);

          revealPath.forEach(([row, col]) => {
            const cell = board[row][col];
            ctx!.fillStyle = CellColor.highLight;
            ctx?.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            if (cell.num !== 0) {
              ctx!.fillStyle = getCellColor(cell.num);
              ctx?.fillText(
                String(cell.num),
                col * cellSize + cellSize / 4,
                row * cellSize + cellSize / 1.2,
              );
            }
            cell.revealed = true;
          });

          playGameBulk(
            revealPath
              .filter(([row, col]) => row !== clickRow || col !== clickCol)
              .map(([row, col]) => ({ row, col })),
          );
          updateVisited(...revealPath.map(([row, col]) => board[row][col]));

          // DRAW NUM
        } else {
          ctx?.fillText(
            String(cell.num),
            clickCol * cellSize + cellSize / 4,
            clickRow * cellSize + cellSize / 1.2,
          );
          updateVisited(cell);
        }
      }
      cell.revealed = true;
    }
  };

export const handleOnContextMenuCurrying =
  (
    board: Cell[][],
    ctx: CanvasRenderingContext2D | null,
    cellSize: number,
    flags: RefObject<number> | null,
    multiplier: number,
    useFlag: (used?: boolean) => void,
  ) =>
  (ev: MouseEvent) => {
    ev.preventDefault();

    if (
      ['null', 'undefined'].indexOf(typeof flags?.current) === -1 &&
      flags!.current! < 1
    )
      return;

    const { x: canvasX, y: canvasY } = (
      ev.target! as HTMLCanvasElement
    ).getBoundingClientRect();

    const [clickRow, clickCol] = getRowAndCol(
      board.length,
      board[0].length,
      cellSize,
      canvasX,
      canvasY,
      ev.x,
      ev.y,
    );

    const cell = board[clickRow][clickCol];

    if (cell.isFlag) {
      cell.isFlag = false;
      return useFlag(true);
    }

    if (cell.revealed) return;

    cell.isFlag = true;
    useFlag();

    const [row, col] = [
      clickRow * cellSize + cellSize / 8,
      clickCol * cellSize + cellSize / 5,
    ];

    ctx?.beginPath();
    ctx!.fillStyle = getCellColor(0);

    let { actualX, actualY } = {
      actualX: col - cellSize * 0.05,
      actualY: row + cellSize * 0.3,
    };
    ctx?.moveTo(actualX, actualY);

    // First line: middle to top crosed
    actualX += cellSize * 0.4;
    actualY -= cellSize * 0.3;
    ctx?.lineTo(actualX, actualY);

    let i = 1;

    while (i < 10) {
      switch (i) {
        // Short line 'pole'
        case 1:
          actualX += cellSize * 0.05;
          break;
        // Pole
        case 2:
          actualY += cellSize * 0.7;
          break;
        // Base right
        case 3:
          actualX += cellSize * 0.25;
          break;
        // Base height
        case 4:
          actualY += cellSize * 0.08;
          break;
        // To base left
        case 5:
          actualX -= cellSize * 0.6;
          break;
        // Base left height
        case 6:
          actualY -= cellSize * 0.08;
          break;
        // Pole left
        case 7:
          actualX += cellSize * 0.25;
          break;
        case 8:
          actualY -= cellSize * 0.2;
          break;
        // Right side of flag
        case 9:
          actualX -= cellSize * 0.4;
          actualY -= cellSize * 0.2;
          break;
      }
      ctx?.lineTo(actualX, actualY);
      i++;
    }

    ctx?.fill();
  };
