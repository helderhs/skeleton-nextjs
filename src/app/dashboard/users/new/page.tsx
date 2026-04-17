import { redirect } from 'next/navigation';
import UserForm from '../_components/UserForm';
import { requireSessionUser } from '@/lib/session';
import { canUserManageUsers } from '@/lib/userManagementAccess';

export default async function NewUserPage() {
  const user = await requireSessionUser('/login?redirect=/dashboard/users/new');

  if (!canUserManageUsers(user)) {
    redirect('/dashboard');
  }

  return <UserForm mode="create" />;
}
