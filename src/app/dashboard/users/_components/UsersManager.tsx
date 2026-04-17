'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import type { ApiResponse, PaginatedResult, UserResponse } from '@/types';

type SerializedUser = Omit<UserResponse, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getPositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function getPageSize(value: string | null) {
  const parsed = getPositiveInteger(value, DEFAULT_PAGE_SIZE);

  if (PAGE_SIZE_OPTIONS.includes(parsed as (typeof PAGE_SIZE_OPTIONS)[number])) {
    return parsed;
  }

  return DEFAULT_PAGE_SIZE;
}

export default function UsersManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('q')?.trim() ?? '';
  const currentPage = getPositiveInteger(searchParams.get('page'), 1);
  const currentPageSize = getPageSize(searchParams.get('pageSize'));
  const status = searchParams.get('status');

  const [usersResult, setUsersResult] = useState<PaginatedResult<SerializedUser>>({
    items: [],
    total: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState(currentQuery);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userToDelete, setUserToDelete] = useState<SerializedUser | null>(null);

  const updateQueryParams = (next: {
    query?: string;
    page?: number;
    pageSize?: number;
    status?: string | null;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.query !== undefined) {
      if (next.query) {
        params.set('q', next.query);
      } else {
        params.delete('q');
      }
    }

    if (next.page !== undefined) {
      if (next.page > 1) {
        params.set('page', String(next.page));
      } else {
        params.delete('page');
      }
    }

    if (next.pageSize !== undefined) {
      if (
        next.pageSize !== DEFAULT_PAGE_SIZE &&
        PAGE_SIZE_OPTIONS.includes(next.pageSize as (typeof PAGE_SIZE_OPTIONS)[number])
      ) {
        params.set('pageSize', String(next.pageSize));
      } else {
        params.delete('pageSize');
      }
    }

    if (next.status !== undefined) {
      if (next.status) {
        params.set('status', next.status);
      } else {
        params.delete('status');
      }
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const loadUsers = async (query: string, page: number, pageSize: number) => {
    setLoading(true);
    setPageError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      if (query) {
        params.set('q', query);
      }

      const response = await fetch(`/api/users?${params.toString()}`, {
        cache: 'no-store',
        credentials: 'include',
      });
      const data = (await response.json()) as ApiResponse<
        PaginatedResult<SerializedUser>
      >;

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao carregar usuarios');
      }

      setUsersResult(
        data.data ?? {
          items: [],
          total: 0,
          page,
          pageSize,
          totalPages: 1,
        }
      );
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : 'Erro ao carregar usuarios'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers(currentQuery, currentPage, currentPageSize);
  }, [currentPage, currentPageSize, currentQuery]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateQueryParams({
      query: searchInput.trim(),
      page: 1,
      status: null,
    });
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) {
      return;
    }

    setDeleteLoading(true);
    setPageError(null);

    try {
      const response = await fetch(`/api/users/${userToDelete._id}`, {
        method: 'DELETE',
      });
      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao remover usuario');
      }

      const shouldGoBackOnePage =
        usersResult.items.length === 1 && usersResult.page > 1;

      setUserToDelete(null);

      if (shouldGoBackOnePage) {
        updateQueryParams({ page: usersResult.page - 1 });
        return;
      }

      await loadUsers(currentQuery, currentPage, currentPageSize);
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : 'Erro ao remover usuario'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const statusMessage =
    status === 'created'
      ? 'Usuario criado com sucesso'
      : status === 'updated'
        ? 'Usuario atualizado com sucesso'
        : null;

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Usuarios
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie os usuarios cadastrados no sistema.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            component={Link}
            href="/dashboard/users/new"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Cadastrar usuario
          </Button>
        </Stack>
      </Stack>

      {statusMessage && (
        <Alert
          severity="success"
          onClose={() => updateQueryParams({ status: null })}
        >
          {statusMessage}
        </Alert>
      )}

      {pageError && (
        <Alert severity="error" onClose={() => setPageError(null)}>
          {pageError}
        </Alert>
      )}

      <Card>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Usuarios encontrados
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {usersResult.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentQuery
                ? `Busca atual: "${currentQuery}"`
                : `Ultimos usuarios cadastrados, ${currentPageSize} por pagina`}
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              width: '100%',
              maxWidth: 520,
              display: 'flex',
              gap: 1.5,
              alignItems: 'flex-start',
            }}
          >
            <TextField
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Buscar por nome ou email"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              select
              value={String(currentPageSize)}
              onChange={(event) =>
                updateQueryParams({
                  pageSize: Number(event.target.value),
                  page: 1,
                  status: null,
                })
              }
              sx={{ minWidth: 96 }}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <MenuItem key={option} value={String(option)}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" sx={{ minWidth: 120 }}>
              Buscar
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Paper sx={{ overflow: 'hidden' }}>
        {loading ? (
          <Box
            sx={{
              minHeight: 260,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : usersResult.items.length === 0 ? (
          <Box
            sx={{
              minHeight: 260,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {currentQuery
                ? 'Nenhum usuario encontrado'
                : 'Nenhum usuario cadastrado'}
            </Typography>
            <Typography color="text.secondary">
              {currentQuery
                ? 'Tente buscar por outro nome ou email.'
                : 'Crie o primeiro usuario para comecar a administrar o sistema.'}
            </Typography>
            {!currentQuery && (
              <Button
                component={Link}
                href="/dashboard/users/new"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ mt: 1 }}
              >
                Criar usuario
              </Button>
            )}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Criado em</TableCell>
                  <TableCell align="right">Acoes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  {usersResult.items.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={user.role === 'admin' ? 'warning' : 'default'}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Ativo' : 'Inativo'}
                          color={user.isActive ? 'success' : 'default'}
                          variant={user.isActive ? 'filled' : 'outlined'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ justifyContent: 'flex-end' }}
                        >
                          <IconButton
                            color="primary"
                            component={Link}
                            href={`/dashboard/users/${user._id}`}
                            aria-label={`Editar ${user.name}`}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => setUserToDelete(user)}
                            aria-label={`Remover ${user.name}`}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'space-between' },
                alignItems: 'center',
                gap: 2,
                px: 3,
                py: 2,
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Mostrando pagina {usersResult.page} de {usersResult.totalPages}
                {` • ${usersResult.pageSize} por pagina`}
              </Typography>
              <Pagination
                count={usersResult.totalPages}
                page={usersResult.page}
                color="primary"
                onChange={(_event, page) =>
                  updateQueryParams({ page, status: null })
                }
              />
            </Box>
          </>
        )}
      </Paper>

      <Dialog
        open={!!userToDelete}
        onClose={deleteLoading ? undefined : () => setUserToDelete(null)}
      >
        <DialogTitle>Remover usuario</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {userToDelete
              ? `Tem certeza que deseja remover ${userToDelete.name}?`
              : 'Tem certeza que deseja remover este usuario?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setUserToDelete(null)}
            disabled={deleteLoading}
          >
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => void handleDeleteUser()}
            disabled={deleteLoading}
          >
            Remover
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
