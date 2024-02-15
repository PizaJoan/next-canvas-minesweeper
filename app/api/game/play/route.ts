import { cookies } from 'next/headers';

import { GAME, USER_ID } from '@/constants/cookies-keys';

export async function POST(request: Request) {
  const data = cookies();
  const user = data.get(USER_ID);
  const game = data.get(GAME);

  const body = await request.json();

  const status = await fetch(`${process.env.API_URL}/game/play`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      ...body,
      userId: user?.value,
      gameId: game?.value,
    }),
  });

  const res = await status.json();

  return Response.json(res);
}
