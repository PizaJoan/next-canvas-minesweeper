import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const data = cookies();
  const user = data.get('user');
  const game = data.get('game');

  const body = await request.json();

  const status = await fetch('http://localhost:3001/game/play', {
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
