import type { Difficulty } from '../types';

export interface IGameContext {
  diffculty: Difficulty;
  width: number;
  height: number;
  mines: number;
}
