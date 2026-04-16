import { redirect } from 'next/navigation';
import { AuthProvider } from '@/hooks/useAuth';
import { getSessionUser } from '@/lib/session';

export default async function AuthRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (user) {
    redirect('/dashboard');
  }

  return <AuthProvider>{children}</AuthProvider>;
}
