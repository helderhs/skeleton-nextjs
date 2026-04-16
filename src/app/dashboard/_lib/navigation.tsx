import type { ReactNode } from 'react';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

export interface DashboardNavigationItem {
  label: string;
  icon: ReactNode;
  path: string;
}

export interface DashboardNavigationSection {
  label: string;
  items: DashboardNavigationItem[];
}

export const dashboardNavigationSections: DashboardNavigationSection[] = [
  {
    label: 'Menu principal',
    items: [
      { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { label: 'Usuarios', icon: <PeopleIcon />, path: '/dashboard/users' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      {
        label: 'Configuracoes',
        icon: <SettingsIcon />,
        path: '/dashboard/settings',
      },
    ],
  },
];

export function isDashboardRouteActive(pathname: string, path: string) {
  if (path === '/dashboard') {
    return pathname === path;
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

export function getDashboardPageTitle(pathname: string) {
  const item = dashboardNavigationSections
    .flatMap((section) => section.items)
    .sort((left, right) => right.path.length - left.path.length)
    .find((entry) => isDashboardRouteActive(pathname, entry.path));

  return item?.label || 'Dashboard';
}
