import AuthLayout from '../_components/AuthLayout';
import LoginForm from '../_components/LoginForm';
import { isPublicUserRegistrationEnabled } from '@/lib/env';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para continuar"
    >
      <LoginForm
        showRegisterLink={isPublicUserRegistrationEnabled()}
      />
    </AuthLayout>
  );
}
