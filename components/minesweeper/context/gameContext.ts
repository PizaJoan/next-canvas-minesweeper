import { createContext } from 'react';

import { IGameContext } from './types';
import { Difficulty } from '../types';

export const initialGameContext: IGameContext = {
  difficulty: Difficulty.medium,
  rows: 9,
  cols: 9,
  mines: 10,
  board: [[]],
};

export const GameContext = createContext<IGameContext>(initialGameContext);
