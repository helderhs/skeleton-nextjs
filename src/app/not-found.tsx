'use client';

import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';

export default function NotFound() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        backgroundColor: 'background.default',
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontWeight: 700, fontSize: '4rem', color: 'primary.main' }}
      >
        404
      </Typography>
      <Typography variant="h6" sx={{ color: 'text.secondary' }}>
        Pagina nao encontrada
      </Typography>
      <Button
        component={Link}
        href="/dashboard"
        variant="contained"
        sx={{ mt: 2 }}
      >
        Voltar
      </Button>
    </Box>
  );
}
