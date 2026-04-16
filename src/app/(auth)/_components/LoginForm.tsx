'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError } = useAuth();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get('redirect') ?? undefined;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login(email, password, { redirectTo });
    } catch {
      // Error state is managed by useAuth.
    }
  };

  const handleEmailChange = (value: string) => {
    if (error) {
      clearError();
    }

    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    if (error) {
      clearError();
    }

    setPassword(value);
  };

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
        id="login-email"
        label="Email"
        type="email"
        fullWidth
        required
        value={email}
        onChange={(event) => handleEmailChange(event.target.value)}
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
        id="login-password"
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        required
        value={password}
        onChange={(event) => handlePasswordChange(event.target.value)}
        sx={{ mb: 1 }}
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
        placeholder="Digite sua senha"
      />

      <Box sx={{ textAlign: 'right', mb: 3 }}>
        <MuiLink
          component={Link}
          href="/forgot-password"
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
            transition: 'all 0.2s',
          }}
        >
          Esqueceu sua senha?
        </MuiLink>
      </Box>

      <Button
        id="login-submit"
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading || !email || !password}
        sx={{
          py: 1.5,
          fontSize: '1rem',
          position: 'relative',
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Nao tem uma conta?{' '}
          <MuiLink
            component={Link}
            href="/register"
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 600,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Cadastre-se
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
