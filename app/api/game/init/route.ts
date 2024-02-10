import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const userCookie = cookies().get('user');
  const body = await request.json();

  const gameConfig = await fetch('http://localhost:3001/game/init', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      ...body,
      userId: userCookie?.value,
    }),
  });

  const res = await gameConfig.json();

  cookies().set('game', res.game.id);

  return Response.json(res);
}
