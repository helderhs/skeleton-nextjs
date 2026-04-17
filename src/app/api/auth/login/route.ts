import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/services/authService';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const session = await login({ email, password });

    const response = NextResponse.json(
      {
        success: true,
        data: session.user,
        message: 'Login realizado com sucesso',
      },
      { status: 200 }
    );

    response.cookies.set(AUTH_COOKIE_NAME, session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro ao fazer login';
    const status = message === 'Usuario inativo' ? 403 : 401;
    return NextResponse.json(
      { success: false, error: message },
      { status }
    );
  }
}
