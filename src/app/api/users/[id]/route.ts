import { NextRequest, NextResponse } from 'next/server';
import { deleteUser, findUserById, updateUser } from '@/services/userService';
import { getRequestSessionUser } from '@/lib/session';
import {
  canAccessManagedUser,
  canUserManageUsers,
  isOwnProfileRoute,
} from '@/lib/userManagementAccess';
import type { ThemeMode, UpdateUserDTO, UserRole } from '@/types';

export const dynamic = 'force-dynamic';

function isProfileRequest(request: NextRequest) {
  return request.nextUrl.searchParams.get('profile') === '1';
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidRole(value: unknown): value is UserRole {
  return value === 'user' || value === 'admin';
}

function isValidThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

function getOptionalString(value: unknown) {
  if (typeof value !== 'string') {
    return undefined;
  }

  return value.trim();
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const sessionUser = await getRequestSessionUser(request);

    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Nao autenticado' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    if (
      !canAccessManagedUser({
        sessionUser,
        targetUserId: id,
        isProfileRoute: isProfileRequest(request),
      })
    ) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado' },
        { status: 403, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const user = await findUserById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario nao encontrado' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json(
      { success: true, data: user },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar usuario' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const sessionUser = await getRequestSessionUser(request);
    const isProfileRoute = isProfileRequest(request);

    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Nao autenticado' },
        { status: 401 }
      );
    }

    if (
      !canAccessManagedUser({
        sessionUser,
        targetUserId: id,
        isProfileRoute,
      })
    ) {
      return NextResponse.json(
        { success: false, error: 'Acesso negado' },
        { status: 403 }
      );
    }

    const hasUserManagementAccess = canUserManageUsers(sessionUser);
    const isOwnProfileAccess = isOwnProfileRoute({
      sessionUser,
      targetUserId: id,
      isProfileRoute,
    });

    const body = (await request.json()) as Partial<UpdateUserDTO>;
    const updateData: UpdateUserDTO = {};

    if (body.name !== undefined) {
      const name = getOptionalString(body.name);

      if (!name) {
        return NextResponse.json(
          { success: false, error: 'Nome invalido' },
          { status: 400 }
        );
      }

      updateData.name = name;
    }

    if (body.email !== undefined) {
      const email = getOptionalString(body.email);

      if (!email || !isValidEmail(email)) {
        return NextResponse.json(
          { success: false, error: 'Informe um email valido' },
          { status: 400 }
        );
      }

      updateData.email = email;
    }

    if (body.role !== undefined) {
      if (!hasUserManagementAccess || isOwnProfileAccess) {
        return NextResponse.json(
          { success: false, error: 'Acesso negado' },
          { status: 403 }
        );
      }

      if (!isValidRole(body.role)) {
        return NextResponse.json(
          { success: false, error: 'Tipo de usuario invalido' },
          { status: 400 }
        );
      }

      updateData.role = body.role;
    }

    if (body.themeMode !== undefined) {
      if (!isValidThemeMode(body.themeMode)) {
        return NextResponse.json(
          { success: false, error: 'Modo de tema invalido' },
          { status: 400 }
        );
      }

      updateData.themeMode = body.themeMode;
    }

    if (body.password !== undefined) {
      const password = getOptionalString(body.password);

      if (!password || password.length < 6) {
        return NextResponse.json(
          {
            success: false,
            error: 'A senha deve ter pelo menos 6 caracteres',
          },
          { status: 400 }
        );
      }

      updateData.password = password;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nenhum dado valido foi informado' },
        { status: 400 }
      );
    }

    const user = await updateUser(id, updateData);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario nao encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: 'Usuario atualizado com sucesso',
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erro ao atualizar usuario';

    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
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

    const { id } = await context.params;
    const removed = await deleteUser(id);

    if (!removed) {
      return NextResponse.json(
        { success: false, error: 'Usuario nao encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Usuario removido com sucesso' },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Erro ao remover usuario' },
      { status: 500 }
    );
  }
}
