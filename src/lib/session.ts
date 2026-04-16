import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
import { getAuthenticatedUser } from '@/services/authService';
import type { UserResponse } from '@/types';

export async function getSessionUser(): Promise<UserResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return getAuthenticatedUser(token);
}

export async function requireSessionUser(
  redirectPath = '/login'
): Promise<UserResponse> {
  const user = await getSessionUser();

  if (!user) {
    redirect(redirectPath);
  }

  return user;
}
