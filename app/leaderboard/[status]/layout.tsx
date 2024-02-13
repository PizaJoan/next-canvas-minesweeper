import type { ReactNode } from 'react';

import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/components/button';
import { ValidStatus } from '../types';

const statusColorMap = {
  [ValidStatus.draft]: 'text-yellow-400',
  [ValidStatus.lost]: 'text-red-400',
  [ValidStatus.won]: 'text-green-400',
};

export default async function LeaderBoardLayout({
  params: { status },
  children,
}: {
  params: { status: ValidStatus };
  children: ReactNode;
}) {
  return (
    <section className="w-100 h-100 flex flex-col items-center justify-center gap-10">
      {status in ValidStatus ? (
        <>
          <article className="flex flex-col gap-8 capitalize">
            <h2
              className={twMerge(
                'text-center text-4xl font-bold',
                statusColorMap[status],
              )}
            >
              {status}
            </h2>
            <ul className="flex flex-row gap-5">
              {Object.keys(ValidStatus).map((validStatus) => (
                <li
                  key={validStatus}
                  className={twMerge(
                    'font-lg font-medium text-slate-300',
                    validStatus === status && 'text-slate-100',
                  )}
                >
                  <Link href={`/leaderboard/${validStatus}`}>
                    {validStatus}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
          {children}
        </>
      ) : (
        <div className="flex flex-col items-center gap-5 text-lg font-bold">
          <p>
            <span className="text-red-400">Woops</span>, looks like the status
            is not valid
          </p>
          <Link href="/leaderboard" className="w-auto">
            <Button customClassNames="text-base">Reload</Button>
          </Link>
        </div>
      )}
    </section>
  );
}
