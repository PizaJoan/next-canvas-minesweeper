import type { Cell, Difficulty } from '../types';

export interface IGameContext {
  difficulty: Difficulty;
  rows: number;
  cols: number;
  mines: number;
  board: Cell[][];
}
