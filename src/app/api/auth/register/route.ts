import { NextRequest, NextResponse } from 'next/server';
import { register } from '@/services/authService';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    const { name, email, password, confirmPassword } = body;

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const session = await register({ name, email, password, confirmPassword });

    const response = NextResponse.json(
      {
        success: true,
        data: session.user,
        message: 'Cadastro realizado com sucesso',
      },
      { status: 201 }
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
      error instanceof Error ? error.message : 'Erro ao cadastrar usuário';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
