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
  requiresUserManagementAccess?: boolean;
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
      {
        label: 'Usuarios',
        icon: <PeopleIcon />,
        path: '/dashboard/users',
        requiresUserManagementAccess: true,
      },
    ],
  },
];

export function getDashboardNavigationSections({
  canManageUsers,
}: {
  canManageUsers: boolean;
}) {
  return dashboardNavigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.requiresUserManagementAccess || canManageUsers
      ),
    }))
    .filter((section) => section.items.length > 0);
}

export function isDashboardRouteActive(pathname: string, path: string) {
  if (path === '/dashboard') {
    return pathname === path;
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

export function getDashboardPageTitle(pathname: string) {
  const item = dashboardNavigationSections
    .flatMap((section) =>
      section.items.map((entry) => ({ label: entry.label, path: entry.path }))
    )
    .sort((left, right) => right.path.length - left.path.length)
    .find((entry) => isDashboardRouteActive(pathname, entry.path));

  return item?.label || 'Dashboard';
}
