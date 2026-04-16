'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Box, Toolbar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useAuth } from '@/hooks/useAuth';
import Header from './Header';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import { getDashboardPageTitle } from '../_lib/navigation';

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen((current) => !current);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header
        title={getDashboardPageTitle(pathname)}
        onMenuToggle={handleDrawerToggle}
        userName={user?.name}
        onLogout={logout}
      />
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          background: (theme) => `
            radial-gradient(ellipse at 20% 50%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, ${alpha(theme.palette.secondary.main, 0.04)} 0%, transparent 50%),
            ${theme.palette.background.default}
          `,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>
      </Box>
    </Box>
  );
}
