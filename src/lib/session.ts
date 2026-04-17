import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
import { getAuthenticatedUser } from '@/services/authService';
import type { UserResponse } from '@/types';

interface CookieStoreLike {
  get(name: string): { value: string } | undefined;
}

async function getSessionUserFromCookieStore(
  cookieStore: CookieStoreLike
): Promise<UserResponse | null> {
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return getAuthenticatedUser(token);
}

export async function getSessionUser(): Promise<UserResponse | null> {
  const cookieStore = await cookies();
  return getSessionUserFromCookieStore(cookieStore);
}

export async function getRequestSessionUser(
  request: Pick<NextRequest, 'cookies'>
): Promise<UserResponse | null> {
  return getSessionUserFromCookieStore(request.cookies);
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
