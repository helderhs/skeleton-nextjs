import AuthLayout from '../_components/AuthLayout';
import RegisterForm from '../_components/RegisterForm';
import { redirect } from 'next/navigation';
import { isPublicUserRegistrationEnabled } from '@/lib/env';

export default function RegisterPage() {
  if (!isPublicUserRegistrationEnabled()) {
    redirect('/login');
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Preencha os dados para comecar"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
