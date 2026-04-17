import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { isPublicUserRegistrationEnabled } from '@/lib/env';

// Rotas que requerem autenticação
const protectedPaths = ['/dashboard'];

// Rotas que só devem ser acessadas por usuários NÃO autenticados
const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );
  const isAuthPath = authPaths.some((path) => pathname === path);

  // Se a rota é protegida, verifica o token
  if (isProtectedPath) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set(AUTH_COOKIE_NAME, '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  // Se o usuário está autenticado e tenta acessar login/register, redireciona
  if (isAuthPath && token) {
    const payload = await verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  if (pathname === '/register' && !isPublicUserRegistrationEnabled()) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
