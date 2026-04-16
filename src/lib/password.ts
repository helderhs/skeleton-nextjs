import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Gera o hash de uma senha.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara uma senha em texto com o hash armazenado.
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
