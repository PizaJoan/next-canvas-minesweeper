import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/button';

import { getGames } from '../requests';
import { ValidOrder, ValidStatus } from '../types';
import { Difficulty } from '@/components/minesweeper/types';

const difficultyColorMap = {
  [Difficulty.easy]: 'text-green-500',
  [Difficulty.medium]: 'text-yellow-500',
  [Difficulty.hard]: 'text-red-500',
  [Difficulty.custom]: 'text-slate-500',
};

export default async function Leaderboard({
  params: { status },
  searchParams: { page, order } = { page: 0, order: ValidOrder.desc },
}: {
  params: { status: ValidStatus };
  searchParams: { page?: number; order: ValidOrder };
}) {
  page = Number(page ?? 1);

  const games = await getGames(status, page, order);

  return (
    <>
      <article className="flex w-full justify-center">
        {(games.length > 0 && (
          <ul className="w-1/2 space-y-5">
            {games.map((game, index) => (
              <li
                className="flex justify-between rounded-xl border border-gray-500 bg-gray-900 px-5 py-3 text-center hover:border-gray-300 hover:bg-gray-700"
                key={game.id}
              >
                <span className="flex flex-col justify-between gap-2 text-start">
                  <span>
                    {index + 1 + (!!page && page > 1 ? page * 20 : 0)}
                    {'. '}
                    {game.user.name ?? 'Unknown'}
                  </span>
                  <div className="flex justify-around gap-5">
                    <span
                      className={twMerge(
                        'flex self-center text-sm font-semibold capitalize',
                        difficultyColorMap[game.board.difficulty],
                      )}
                    >
                      {game.board.difficulty}
                    </span>
                    <span className="flex self-center text-sm font-normal">
                      {game.time} s
                    </span>
                  </div>
                </span>
                <span className="flex self-center text-right">
                  {game.score} pts
                </span>
              </li>
            ))}
          </ul>
        )) || (
          <span className="text-base font-semibold">
            There are no results... Try different status
          </span>
        )}
      </article>
      {(games.length === 20 || !!page) && (
        <footer className="flex flex-row  gap-5 self-center">
          {page > 1 && (
            <Link
              href={{
                pathname: `/leaderboard/${status}`,
                query: {
                  ...(order !== ValidOrder.desc && { order }),
                  ...(page > 1 && { page: page - 1 }),
                },
              }}
            >
              <Button>Prev</Button>
            </Link>
          )}
          {games.length === 20 && (
            <Link
              href={{
                pathname: `/leaderboard/${status}`,
                query: {
                  ...(order !== ValidOrder.desc && { order }),
                  page: page + 1,
                },
              }}
            >
              <Button>Next</Button>
            </Link>
          )}
        </footer>
      )}
    </>
  );
}
