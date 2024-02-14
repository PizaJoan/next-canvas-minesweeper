import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  const reqURL = new URL(`${process.env.API_URL}/user/init`);
  reqURL.searchParams.append('token', token!);

  const alreadyUser = cookies().get('userId')?.value;
  if (alreadyUser) reqURL.searchParams.append('userId', alreadyUser);

  const response = await fetch(reqURL);
  cookies().set('username', await response.text());

  return redirect('/');
}
