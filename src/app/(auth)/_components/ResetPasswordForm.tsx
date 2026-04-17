'use client';

import { useState, Suspense } from 'react';
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
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircleOutlined as CheckCircleIcon,
  ErrorOutlined as ErrorIcon,
} from '@mui/icons-material';
import type { ApiResponse } from '@/types';

function ResetPasswordFormContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h6" color="text.primary" gutterBottom>
          Link inválido
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Não encontramos o token de redefinição na URL.
        </Typography>
        <Button
          component={Link}
          href="/forgot-password"
          variant="contained"
          fullWidth
        >
          Solicitar novo link
        </Button>
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h6" color="text.primary" gutterBottom>
          Senha atualizada!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {success}
        </Typography>
        <Button
          component={Link}
          href="/login"
          variant="contained"
          fullWidth
        >
          Fazer Login
        </Button>
      </Box>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao redefinir a senha');
      }

      setSuccess(data.message || 'Senha alterada com sucesso.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao processar solicitação'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      <TextField
        id="reset-password"
        label="Nova senha"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        required
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          if (error) setError('');
        }}
        sx={{ mb: 2.5 }}
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
        placeholder="Mínimo de 6 caracteres"
      />

      <TextField
        id="reset-confirm-password"
        label="Confirmar nova senha"
        type={showConfirmPassword ? 'text' : 'password'}
        fullWidth
        required
        value={confirmPassword}
        onChange={(event) => {
          setConfirmPassword(event.target.value);
          if (error) setError('');
        }}
        sx={{ mb: 3 }}
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
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  edge="end"
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        placeholder="Repita a nova senha"
      />

      <Button
        id="reset-submit"
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading || !password || !confirmPassword}
        sx={{
          py: 1.5,
          fontSize: '1rem',
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Salvar nova senha'
        )}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <MuiLink
          component={Link}
          href="/login"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
            transition: 'color 0.2s',
          }}
        >
          Voltar para o login
        </MuiLink>
      </Box>
    </Box>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
