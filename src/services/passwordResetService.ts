import dbConnect from '@/lib/mongodb';
import PasswordResetToken from '@/models/PasswordResetToken';
import { findUserByEmail, findUserById, updateUser } from './userService';
import { generateResetToken, hashToken } from '@/lib/token';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function requestPasswordReset(email: string): Promise<void> {
  await dbConnect();

  const user = await findUserByEmail(email);

  // Se não achar o usuário, não joga erro (evitar enumeration)
  // Apenas simula o tempo de resposta
  if (!user) {
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 500));
    return;
  }

  // Remove tokens anteriores deste usuário para garantir só um ativo
  await PasswordResetToken.deleteMany({ userId: user._id });

  // Gera o raw token e o hash
  const resetToken = generateResetToken();
  const tokenHash = hashToken(resetToken);

  // Expira em 1 hora
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await PasswordResetToken.create({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  // Monta a URL de reset baseada no env
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

  // Tenta enviar o e-mail, se falhar não derruba a resposta pro usuário
  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch (error) {
    console.error('Erro ao enviar email de reset:', error);
    // Idealmente num cenário real poderíamos logar para re-tentar depois,
    // mas não queremos falhar a request para o client
  }
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await dbConnect();

  const tokenHash = hashToken(token);

  // Busca o token válido (ainda não expirado)
  const resetTokenDoc = await PasswordResetToken.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  });

  if (!resetTokenDoc) {
    throw new Error('Token inválido ou expirado');
  }

  const userId = resetTokenDoc.userId.toString();
  const user = await findUserById(userId);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  // Atualiza a senha usando o userService (ele faz o hash)
  await updateUser(userId, { password });

  // Remove o token que acabou de ser usado (e possíveis outros)
  await PasswordResetToken.deleteMany({ userId });
}
