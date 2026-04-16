import AuthLayout from '../_components/AuthLayout';
import ForgotPasswordForm from '../_components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Recuperar senha"
      subtitle="Informe seu email e enviaremos um link de recuperacao"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
