import { cookies } from 'next/headers';

import { USERNAME } from '@/constants/cookies-keys';

import { LoginUser } from '@/components/login';
import { Minesweeper } from '@/components/minesweeper/minesweeper';

const Game = () => {
  const user = cookies().has(USERNAME);

  return (
    <section className="flex flex-col items-center gap-5">
      <h1 className="text-4xl font-bold">
        Hello and welcome to the Game itself, enjoy!
      </h1>
      {!user && <LoginUser />}
      <Minesweeper />
    </section>
  );
};

export default Game;
