import { IGameContext } from '@/components/minesweeper/context/types';
import { Cell } from '@/components/minesweeper/types';

const POST = (url: string, body: any) =>
  fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }).then((res) => res.json());

export const initUser = () => fetch('/api/user/init');

export const initGame = (body: Partial<IGameContext>) =>
  POST('/api/game/init', body);

export const playGame = (body: { row: number; col: number }) =>
  POST('/api/game/play', body);
