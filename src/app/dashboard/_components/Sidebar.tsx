'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  dashboardNavigationSections,
  isDashboardRouteActive,
} from '../_lib/navigation';

export const DRAWER_WIDTH = 280;

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Toolbar
        sx={{
          px: 3,
          py: 2,
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AutoAwesomeIcon sx={{ color: 'common.white', fontSize: 22 }} />
        </Box>
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 700,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
          }}
        >
          Skeleton
        </Typography>
      </Toolbar>

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

      <Box sx={{ flex: 1, py: 2, px: 1 }}>
        {dashboardNavigationSections.map((section, index) => (
          <Box key={section.label} sx={{ mt: index === 0 ? 0 : 3 }}>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                px: 2,
                py: 1,
                color: 'text.secondary',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
              }}
            >
              {section.label}
            </Typography>

            <List component="nav" disablePadding>
              {section.items.map((item) => {
                const isActive = isDashboardRouteActive(pathname, item.path);

                return (
                  <ListItemButton
                    key={item.path}
                    component={Link}
                    href={item.path}
                    selected={isActive}
                    onClick={mobileOpen ? onClose : undefined}
                    sx={{ mb: 0.3 }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isActive ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: '0.9rem',
                            fontWeight: isActive ? 600 : 400,
                          },
                        },
                      }}
                    />
                    {isActive && (
                      <Box
                        sx={{
                          width: 4,
                          height: 24,
                          borderRadius: 2,
                          background: (theme) =>
                            `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          position: 'absolute',
                          right: 0,
                        }}
                      />
                    )}
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography
          variant="caption"
          sx={{
            color: (theme) => alpha(theme.palette.text.secondary, 0.6),
          }}
        >
          v1.0.0 | Skeleton App
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
