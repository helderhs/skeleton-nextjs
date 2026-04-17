import { redirect } from 'next/navigation';
import UsersManager from './_components/UsersManager';
import { requireSessionUser } from '@/lib/session';
import { canUserManageUsers } from '@/lib/userManagementAccess';

export default async function DashboardUsersPage() {
  const user = await requireSessionUser('/login?redirect=/dashboard/users');

  if (!canUserManageUsers(user)) {
    redirect('/dashboard');
  }

  return <UsersManager />;
}
