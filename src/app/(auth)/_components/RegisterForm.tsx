'use client';

import {
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading, error, clearError } = useAuth();

  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const isPasswordTooShort = password.length > 0 && password.length < 6;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passwordsDoNotMatch || isPasswordTooShort) {
      return;
    }

    try {
      await register(name, email, password, confirmPassword);
    } catch {
      // Error state is managed by useAuth.
    }
  };

  const handleFieldChange = (
    setter: Dispatch<SetStateAction<string>>,
    value: string
  ) => {
    if (error) {
      clearError();
    }

    setter(value);
  };

  const isSubmitDisabled =
    loading ||
    !name ||
    !email ||
    !password ||
    !confirmPassword ||
    passwordsDoNotMatch ||
    isPasswordTooShort;

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={clearError}
        >
          {error}
        </Alert>
      )}

      <TextField
        id="register-name"
        label="Nome completo"
        type="text"
        fullWidth
        required
        value={name}
        onChange={(event) => handleFieldChange(setName, event.target.value)}
        sx={{ mb: 2.5 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
        placeholder="Seu nome completo"
      />

      <TextField
        id="register-email"
        label="Email"
        type="email"
        fullWidth
        required
        value={email}
        onChange={(event) => handleFieldChange(setEmail, event.target.value)}
        sx={{ mb: 2.5 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
        placeholder="seu@email.com"
      />

      <TextField
        id="register-password"
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        required
        value={password}
        onChange={(event) => handleFieldChange(setPassword, event.target.value)}
        sx={{ mb: 2.5 }}
        error={isPasswordTooShort}
        helperText="A senha deve ter pelo menos 6 caracteres"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((current) => !current)}
                  edge="end"
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        placeholder="Minimo 6 caracteres"
      />

      <TextField
        id="register-confirm-password"
        label="Confirmar senha"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        required
        value={confirmPassword}
        onChange={(event) =>
          handleFieldChange(setConfirmPassword, event.target.value)
        }
        sx={{ mb: 3 }}
        error={passwordsDoNotMatch}
        helperText={passwordsDoNotMatch ? 'As senhas nao conferem' : ' '}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
              </InputAdornment>
            ),
          },
        }}
        placeholder="Repita a senha"
      />

      <Button
        id="register-submit"
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isSubmitDisabled}
        sx={{
          py: 1.5,
          fontSize: '1rem',
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Criar conta'
        )}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Ja tem uma conta?{' '}
          <MuiLink
            component={Link}
            href="/login"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Entrar
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
