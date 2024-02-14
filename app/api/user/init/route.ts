import { cookies } from 'next/headers';

export async function GET() {
  const user = cookies().has('userId');

  if (!user) {
    const response = await fetch(`${process.env.API_URL}/user/init`);

    const body = await response.json();

    cookies().set('userId', body.id);
    cookies().set('username', body.name);
  }

  return Response.json({ message: 'loggedIn' });
}
