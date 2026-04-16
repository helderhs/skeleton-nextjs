import DashboardShell from './_components/DashboardShell';
import { AuthProvider } from '@/hooks/useAuth';
import { requireSessionUser } from '@/lib/session';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSessionUser('/login?redirect=/dashboard');

  return (
    <AuthProvider initialUser={user}>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
