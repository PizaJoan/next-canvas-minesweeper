import { Difficulty } from '@/components/minesweeper/types';

export enum ValidStatus {
  draft = 'draft',
  lost = 'lost',
  won = 'won',
}

export enum ValidOrder {
  asc = 'ASC',
  desc = 'DESC',
}

export interface GameLeaderboard {
  id: number;
  status: ValidStatus;
  score: number;
  time: number;
  board: {
    difficulty: Difficulty;
  };
  user: {
    name: string;
  };
}
