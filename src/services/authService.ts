import {
  findUserByEmail,
  createUser,
  findUserById,
  normalizeThemeMode,
} from './userService';
import { comparePassword } from '@/lib/password';
import { generateToken, verifyToken } from '@/lib/auth';
import type {
  LoginDTO,
  RegisterDTO,
  AuthSession,
  UserResponse,
} from '@/types';

export async function login(data: LoginDTO): Promise<AuthSession> {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new Error('Email ou senha invalidos');
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error('Email ou senha invalidos');
  }

  const token = await generateToken({
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
  });

  return {
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role ?? 'user',
      themeMode: normalizeThemeMode(user.themeMode),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  };
}

export async function register(data: RegisterDTO): Promise<AuthSession> {
  if (data.password !== data.confirmPassword) {
    throw new Error('As senhas nao conferem');
  }

  if (data.password.length < 6) {
    throw new Error('A senha deve ter pelo menos 6 caracteres');
  }

  const user = await createUser({
    name: data.name,
    email: data.email,
    password: data.password,
    role: 'user',
    themeMode: 'dark',
  });

  const token = await generateToken({
    userId: user._id,
    email: user.email,
    name: user.name,
  });

  return { user, token };
}

export async function getAuthenticatedUser(
  token: string
): Promise<UserResponse | null> {
  const payload = await verifyToken(token);

  if (!payload) {
    return null;
  }

  return findUserById(payload.userId);
}
