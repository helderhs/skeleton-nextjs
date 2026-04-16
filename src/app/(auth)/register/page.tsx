import AuthLayout from '../_components/AuthLayout';
import RegisterForm from '../_components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Preencha os dados para comecar"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
