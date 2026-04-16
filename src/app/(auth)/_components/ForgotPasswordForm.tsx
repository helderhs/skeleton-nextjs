'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Link as MuiLink,
  TextField,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import type { ApiResponse } from '@/types';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Informe seu email');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar solicitacao');
      }

      setSuccess(
        data.message ||
          'Se o email estiver cadastrado, enviaremos um link de recuperacao.'
      );
      setEmail('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao processar solicitacao'
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

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <TextField
        id="forgot-email"
        label="Email"
        type="email"
        fullWidth
        required
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (error) {
            setError('');
          }
        }}
        sx={{ mb: 3 }}
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

      <Button
        id="forgot-submit"
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={loading || !email}
        sx={{
          py: 1.5,
          fontSize: '1rem',
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Enviar link de recuperacao'
        )}
      </Button>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <MuiLink
          component={Link}
          href="/login"
          sx={{
            color: 'text.secondary',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            '&:hover': {
              color: 'primary.main',
            },
            transition: 'color 0.2s',
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Voltar para o login
        </MuiLink>
      </Box>
    </Box>
  );
}
