import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const user = cookies().get('user');

  const body = await request.json();

  const gameConfig = await fetch(`${process.env.API_URL}/game/init`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      ...body,
      userId: user?.value,
    }),
  });

  const res = await gameConfig.json();

  cookies().set('game', res.game.id);

  return Response.json(res);
}
