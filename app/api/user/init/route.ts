import { cookies } from 'next/headers';

export async function GET() {
  const user = cookies().has('user');
  if (!user) {
    // DO FETCH
    const response = await fetch('http://localhost:3001/user/init');

    return Response.json(
      { message: 'alreadyLoggedIn' },
      { headers: response.headers },
    );
  }

  return Response.json({ message: 'loggedIn' });
}
