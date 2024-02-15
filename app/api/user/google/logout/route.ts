import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { USERNAME, USER_ID } from '@/constants/cookies-keys';

export async function GET() {
  cookies().delete(USERNAME);
  cookies().delete(USER_ID);

  return redirect('/');
}
