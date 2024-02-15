import { cookies } from 'next/headers';

import { USERNAME, USER_ID } from '@/constants/cookies-keys';

export async function GET() {
  const user = cookies().has(USER_ID);

  if (!user) {
    const response = await fetch(`${process.env.API_URL}/user/init`);

    const body = await response.json();

    cookies().set(USER_ID, body.id);
    cookies().set(USERNAME, body.name);
  }

  return Response.json({ message: 'loggedIn' });
}
