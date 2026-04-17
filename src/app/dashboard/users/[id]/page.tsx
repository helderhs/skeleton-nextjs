import { notFound, redirect } from 'next/navigation';
import { findUserById } from '@/services/userService';
import { requireSessionUser } from '@/lib/session';
import { canAccessManagedUser } from '@/lib/userManagementAccess';
import UserForm from '../_components/UserForm';

export default async function EditUserPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ profile?: string }>;
}) {
  const { id } = await params;
  const { profile } = await searchParams;
  const sessionUser = await requireSessionUser(
    `/login?redirect=/dashboard/users/${id}`
  );
  const isProfileRoute = profile === '1';

  if (
    !canAccessManagedUser({
      sessionUser,
      targetUserId: id,
      isProfileRoute,
    })
  ) {
    redirect('/dashboard');
  }

  const user = await findUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <UserForm
      mode="edit"
      variant={isProfileRoute ? 'profile' : 'user'}
      initialUser={{
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        themeMode: user.themeMode,
        isActive: user.isActive,
      }}
    />
  );
}
