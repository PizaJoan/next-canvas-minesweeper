import { GameLeaderboard, ValidOrder, ValidStatus } from './types';

export const getGames = (
  status: ValidStatus,
  page?: number,
  order: ValidOrder = ValidOrder.desc,
): Promise<GameLeaderboard[]> => {
  const url = new URL(`${process.env.API_URL}/game/leaderboard`);

  url.searchParams.append('status', status);
  url.searchParams.append('order', order);

  if (page) url.searchParams.append('page', String(page));

  return fetch(url, { cache: 'no-store' }).then((res) => res.json());
};
