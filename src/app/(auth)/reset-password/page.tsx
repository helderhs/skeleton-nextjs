import AuthLayout from '../_components/AuthLayout';
import ResetPasswordForm from '../_components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Redefinir senha"
      subtitle="Crie uma nova senha para sua conta"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
