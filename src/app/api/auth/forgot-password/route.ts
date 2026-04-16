import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // TODO: Implementar envio real de email de recuperação
    // Por enquanto, simula o envio com sucesso
    return NextResponse.json(
      {
        success: true,
        message:
          'Se o email estiver cadastrado, enviaremos um link de recuperação.',
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}
