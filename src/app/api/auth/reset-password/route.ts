import { NextResponse } from 'next/server';
import { resetPassword } from '@/services/passwordResetService';
import type { ResetPasswordDTO } from '@/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResetPasswordDTO;
    const { token, password, confirmPassword } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token é obrigatório' },
        { status: 400 }
      );
    }

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Senha e confirmação são obrigatórias' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'As senhas não conferem' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    await resetPassword(token, password);

    return NextResponse.json(
      {
        success: true,
        message: 'Senha alterada com sucesso.',
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Token inválido ou expirado') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    console.error('Erro em reset-password:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}
