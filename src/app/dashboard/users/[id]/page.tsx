import { notFound } from 'next/navigation';
import { findUserById } from '@/services/userService';
import UserForm from '../_components/UserForm';

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await findUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <UserForm
      mode="edit"
      initialUser={{
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    />
  );
}
