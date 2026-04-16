'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import type { ApiResponse, UserResponse, UserRole } from '@/types';

interface EditableUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UserFormProps {
  mode: 'create' | 'edit';
  initialUser?: EditableUser;
}

export default function UserForm({ mode, initialUser }: UserFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialUser?.name ?? '');
  const [email, setEmail] = useState(initialUser?.email ?? '');
  const [role, setRole] = useState<UserRole>(initialUser?.role ?? 'user');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isCreateMode = mode === 'create';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedName || !trimmedEmail) {
      setError('Nome e email sao obrigatorios');
      return;
    }

    if (isCreateMode && !trimmedPassword) {
      setError('Senha e obrigatoria');
      return;
    }

    if (trimmedPassword && trimmedPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (trimmedPassword || trimmedConfirmPassword) {
      if (trimmedPassword !== trimmedConfirmPassword) {
        setError('As senhas nao conferem');
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch(
        isCreateMode ? '/api/users' : `/api/users/${initialUser?._id}`,
        {
          method: isCreateMode ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: trimmedName,
            email: trimmedEmail,
            role,
            password: trimmedPassword || undefined,
          }),
        }
      );
      const data = (await response.json()) as ApiResponse<UserResponse>;

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar usuario');
      }

      router.push(
        `/dashboard/users?status=${isCreateMode ? 'created' : 'updated'}`
      );
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Erro ao salvar usuario'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <MuiLink
          component={Link}
          href="/dashboard/users"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            mb: 2,
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Voltar para usuarios
        </MuiLink>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {isCreateMode ? 'Novo usuario' : 'Editar usuario'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isCreateMode
            ? 'Preencha os dados para cadastrar um novo usuario.'
            : 'Atualize os dados do usuario selecionado.'}
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <Stack spacing={2.5}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                label="Nome"
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                fullWidth
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                select
                label="Tipo de usuario"
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
                fullWidth
                helperText="Novos usuarios iniciam como user por padrao"
              >
                <MenuItem value="user">user</MenuItem>
                <MenuItem value="admin">admin</MenuItem>
              </TextField>

              <TextField
                label={isCreateMode ? 'Senha' : 'Nova senha'}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                required={isCreateMode}
                helperText={
                  isCreateMode
                    ? 'Minimo de 6 caracteres'
                    : 'Deixe em branco para manter a senha atual'
                }
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
              />

              <TextField
                label="Confirmar senha"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                fullWidth
                helperText="Preencha apenas se informar uma senha"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
                <Button
                  component={Link}
                  href="/dashboard/users"
                  variant="outlined"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : isCreateMode ? (
                    'Cadastrar usuario'
                  ) : (
                    'Salvar alteracoes'
                  )}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
