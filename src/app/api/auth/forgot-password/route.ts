import { NextResponse } from 'next/server';
import { requestPasswordReset } from '@/services/passwordResetService';
import type { ForgotPasswordDTO } from '@/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ForgotPasswordDTO;

    if (!body.email) {
      return NextResponse.json(
        { success: false, error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    await requestPasswordReset(body.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Se o email estiver cadastrado, enviaremos um link de recuperação.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro em forgot-password:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}
