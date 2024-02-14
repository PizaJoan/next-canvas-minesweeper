import { cookies } from 'next/headers';

export async function GET() {
  const user = cookies().has('userId');

  if (!user) {
    const response = await fetch(`${process.env.API_URL}/user/init`);

    cookies().set('userId', await response.text());
  }

  return Response.json({ message: 'loggedIn' });
}
