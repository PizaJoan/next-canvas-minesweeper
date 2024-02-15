import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { USERNAME, USER_ID } from '@/constants/cookies-keys';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  const reqURL = new URL(`${process.env.API_URL}/user/init`);
  reqURL.searchParams.append('token', token!);

  const alreadyUser = cookies().get(USER_ID)?.value;
  if (alreadyUser) reqURL.searchParams.append('userId', alreadyUser);

  const response = await fetch(reqURL);
  const body = await response.json();

  cookies().set(USER_ID, body.id);
  cookies().set(USERNAME, body.name);

  return redirect('/');
}
