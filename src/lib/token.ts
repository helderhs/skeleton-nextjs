import crypto from 'crypto';

/**
 * Gera um token hexadecimal aleatório (32 bytes).
 */
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Retorna o hash SHA-256 do token (para armazenar ou comparar no banco).
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
