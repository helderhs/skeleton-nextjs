import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/services/authService';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const user = await getAuthenticatedUser(token);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Token inválido ou expirado' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json(
      { success: true, data: user },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar usuário' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
