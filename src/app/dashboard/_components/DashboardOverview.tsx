'use client';

import type { ReactNode } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { alpha, type Theme } from '@mui/material/styles';
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  AttachMoney as AttachMoneyIcon,
  MoreVert as MoreVertIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

type DashboardTone = 'primary' | 'secondary' | 'warning' | 'info';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: ReactNode;
  tone: DashboardTone;
}

interface ActivityItem {
  title: string;
  description: string;
  time: string;
  tone: DashboardTone;
}

interface ProjectProgressItem {
  name: string;
  progress: number;
  tone: DashboardTone;
}

function getToneGradient(theme: Theme, tone: DashboardTone) {
  const palette = theme.palette[tone];
  return `linear-gradient(135deg, ${palette.main} 0%, ${palette.light} 100%)`;
}

function StatCard({ title, value, change, icon, tone }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) =>
            `0 12px 40px ${alpha(theme.palette.common.black, 0.32)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: (theme) => getToneGradient(theme, tone),
            }}
          >
            {icon}
          </Avatar>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Chip
            size="small"
            icon={
              isPositive ? (
                <ArrowUpwardIcon sx={{ fontSize: '14px !important' }} />
              ) : (
                <ArrowDownwardIcon sx={{ fontSize: '14px !important' }} />
              )
            }
            label={`${Math.abs(change)}%`}
            sx={{
              backgroundColor: (theme) =>
                alpha(
                  theme.palette[isPositive ? 'success' : 'error'].main,
                  0.14
                ),
              color: isPositive ? 'success.main' : 'error.main',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
              '& .MuiChip-icon': {
                color: 'inherit',
              },
            }}
          />
          <Typography variant="caption" color="text.secondary">
            vs. mes anterior
          </Typography>
        </Box>
      </CardContent>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: (theme) => getToneGradient(theme, tone),
        }}
      />
    </Card>
  );
}

const recentActivities: ActivityItem[] = [
  {
    title: 'Novo usuario cadastrado',
    description: 'Maria Silva criou uma nova conta',
    time: '2 min atras',
    tone: 'primary',
  },
  {
    title: 'Pedido realizado',
    description: 'Pedido #1234 foi processado',
    time: '15 min atras',
    tone: 'secondary',
  },
  {
    title: 'Relatorio gerado',
    description: 'Relatorio mensal de vendas',
    time: '1h atras',
    tone: 'warning',
  },
  {
    title: 'Sistema atualizado',
    description: 'Versao 1.2.0 publicada',
    time: '3h atras',
    tone: 'info',
  },
];

const projectProgress: ProjectProgressItem[] = [
  { name: 'Website Redesign', progress: 75, tone: 'primary' },
  { name: 'Mobile App', progress: 45, tone: 'secondary' },
  { name: 'API Integration', progress: 90, tone: 'warning' },
  { name: 'Database Migration', progress: 30, tone: 'info' },
];

export default function DashboardOverview() {
  const { user } = useAuth();

  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Usuario';

  const stats: StatCardProps[] = [
    {
      title: 'Receita total',
      value: 'R$ 48.5k',
      change: 12.5,
      icon: <AttachMoneyIcon />,
      tone: 'primary',
    },
    {
      title: 'Usuarios ativos',
      value: '2,340',
      change: 8.2,
      icon: <PeopleIcon />,
      tone: 'secondary',
    },
    {
      title: 'Pedidos',
      value: '1,893',
      change: -2.4,
      icon: <ShoppingCartIcon />,
      tone: 'warning',
    },
    {
      title: 'Taxa de crescimento',
      value: '24.5%',
      change: 4.1,
      icon: <TrendingUpIcon />,
      tone: 'info',
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Ola, {firstName}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aqui esta um resumo do que esta acontecendo hoje.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={stat.title}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Atividade recente
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {recentActivities.map((activity) => (
                  <Box
                    key={`${activity.title}-${activity.time}`}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: (theme) =>
                          theme.palette[activity.tone].main,
                        mt: 0.8,
                        flexShrink: 0,
                        boxShadow: (theme) =>
                          `0 0 10px ${alpha(theme.palette[activity.tone].main, 0.3)}`,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {activity.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        {activity.description}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ flexShrink: 0 }}
                    >
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Progresso dos projetos
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {projectProgress.map((project) => (
                  <Box key={project.name}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {project.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 600 }}
                      >
                        {project.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: (theme) =>
                          alpha(theme.palette.text.secondary, 0.12),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          background: (theme) =>
                            getToneGradient(theme, project.tone),
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
