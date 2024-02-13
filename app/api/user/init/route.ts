import { cookies } from 'next/headers';

export async function GET() {
  const user = cookies().has('user');

  if (!user) {
    const response = await fetch(`${process.env.API_URL}/user/init`);

    cookies().set('user', await response.text());
  }

  return Response.json({ message: 'loggedIn' });
}
