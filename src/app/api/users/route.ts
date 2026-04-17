import { NextRequest, NextResponse } from 'next/server';
import { createUser, listUsers } from '@/services/userService';
import { getRequestSessionUser } from '@/lib/session';
import { canUserManageUsers } from '@/lib/userManagementAccess';
import type { CreateUserDTO, UserRole } from '@/types';

export const dynamic = 'force-dynamic';

async function validateUserManagementAccess(request: NextRequest) {
  const sessionUser = await getRequestSessionUser(request);

  if (!sessionUser) {
    return NextResponse.json(
      { success: false, error: 'Nao autenticado' },
      { status: 401 }
    );
  }

  if (!canUserManageUsers(sessionUser)) {
    return NextResponse.json(
      { success: false, error: 'Acesso negado' },
      { status: 403 }
    );
  }

  return null;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidRole(value: unknown): value is UserRole {
  return value === 'user' || value === 'admin';
}

function getRequiredString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function getPositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    const accessError = await validateUserManagementAccess(request);

    if (accessError) {
      return accessError;
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('q') ?? '';
    const page = getPositiveInteger(searchParams.get('page'), 1);
    const pageSize = getPositiveInteger(searchParams.get('pageSize'), 10);
    const users = await listUsers({ search, page, pageSize });

    return NextResponse.json(
      { success: true, data: users },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erro ao listar usuarios' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessError = await validateUserManagementAccess(request);

    if (accessError) {
      return accessError;
    }

    const body = (await request.json()) as Partial<CreateUserDTO>;
    const name = getRequiredString(body.name);
    const email = getRequiredString(body.email);
    const password = getRequiredString(body.password);

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Nome, email e senha sao obrigatorios' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Informe um email valido' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'A senha deve ter pelo menos 6 caracteres',
        },
        { status: 400 }
      );
    }

    if (body.role !== undefined && !isValidRole(body.role)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de usuario invalido' },
        { status: 400 }
      );
    }

    const user = await createUser({
      name,
      email,
      password,
      role: body.role ?? 'user',
    });

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: 'Usuario criado com sucesso',
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro ao criar usuario';

    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
