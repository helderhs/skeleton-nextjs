'use client';

import Link from 'next/link';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { alpha } from '@mui/material/styles';

const CURRENT_YEAR = new Date().getFullYear();

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: (theme) => `
          radial-gradient(ellipse at 20% 50%, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, ${alpha(theme.palette.secondary.main, 0.06)} 0%, transparent 50%),
          radial-gradient(ellipse at 50% 80%, ${alpha(theme.palette.primary.main, 0.04)} 0%, transparent 50%),
          ${theme.palette.background.default}
        `,
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundImage: (theme) => `
            linear-gradient(${alpha(theme.palette.text.secondary, 0.03)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha(theme.palette.text.secondary, 0.03)} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: (theme) =>
                `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
              fontSize: '1.5rem',
            }}
          >
            *
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            border: (theme) =>
              `1px solid ${alpha(theme.palette.text.secondary, 0.08)}`,
            background: (theme) => alpha(theme.palette.background.paper, 0.72),
            backdropFilter: 'blur(20px)',
            boxShadow: (theme) =>
              `0 20px 60px ${alpha(theme.palette.common.black, 0.3)}`,
          }}
        >
          {children}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', mt: 4, opacity: 0.6 }}
        >
          (c) {CURRENT_YEAR}{' '}
          <MuiLink
            component={Link}
            href="/"
            color="inherit"
            underline="hover"
            sx={{
              '&:hover': { color: 'primary.main' },
              transition: 'color 0.2s',
            }}
          >
            Skeleton App
          </MuiLink>
          . Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
