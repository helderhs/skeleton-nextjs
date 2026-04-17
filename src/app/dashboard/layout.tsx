import DashboardShell from './_components/DashboardShell';
import { AuthProvider } from '@/hooks/useAuth';
import { requireSessionUser } from '@/lib/session';
import { canUserManageUsers } from '@/lib/userManagementAccess';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireSessionUser('/login?redirect=/dashboard');
  const canManageUsers = canUserManageUsers(user);

  return (
    <AuthProvider initialUser={user}>
      <DashboardShell canManageUsers={canManageUsers}>
        {children}
      </DashboardShell>
    </AuthProvider>
  );
}
