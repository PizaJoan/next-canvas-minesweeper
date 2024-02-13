import { GameLeaderboard, ValidOrder, ValidStatus } from './types';

export const getGames = (
  status: ValidStatus,
  page?: number,
  order: ValidOrder = ValidOrder.desc,
): Promise<GameLeaderboard[]> => {
  const url = new URL('http://localhost:3001/game/leaderboard');

  url.searchParams.append('status', status);
  url.searchParams.append('order', order);

  if (page) url.searchParams.append('page', String(page));

  return fetch(url).then((res) => res.json());
};