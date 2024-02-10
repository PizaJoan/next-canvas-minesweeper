import { cookies } from 'next/headers';

export async function GET() {
  const user = cookies().has('user');

  if (!user) {
    const response = await fetch('http://localhost:3001/user/init');

    cookies().set('user', await response.text());
  }

  return Response.json({ message: 'loggedIn' });
}
