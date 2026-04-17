import 'server-only';

import type { UserResponse } from '@/types';
import { isAdminOnlyUserManagementEnabled } from './env';

interface UserAccessOptions {
  sessionUser: Pick<UserResponse, '_id' | 'role'> | null | undefined;
  targetUserId: string;
  isProfileRoute?: boolean;
}

export function canUserManageUsers(
  user: Pick<UserResponse, 'role'> | null | undefined
) {
  if (!user) {
    return false;
  }

  if (!isAdminOnlyUserManagementEnabled()) {
    return true;
  }

  return user.role === 'admin';
}

export function isOwnProfileRoute({
  sessionUser,
  targetUserId,
  isProfileRoute = false,
}: UserAccessOptions) {
  return Boolean(
    sessionUser && isProfileRoute && sessionUser._id === targetUserId
  );
}

export function canAccessManagedUser(options: UserAccessOptions) {
  return (
    canUserManageUsers(options.sessionUser) || isOwnProfileRoute(options)
  );
}
