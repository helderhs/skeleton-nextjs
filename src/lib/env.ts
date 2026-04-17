const TRUE_ENV_VALUES = new Set(['1', 'true', 'yes', 'on']);
const FALSE_ENV_VALUES = new Set(['0', 'false', 'no', 'off']);

function parseBooleanEnvValue(value: string | undefined, fallback: boolean) {
  if (!value) {
    return fallback;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (TRUE_ENV_VALUES.has(normalizedValue)) {
    return true;
  }

  if (FALSE_ENV_VALUES.has(normalizedValue)) {
    return false;
  }

  return fallback;
}

export function isPublicUserRegistrationEnabled() {
  return parseBooleanEnvValue(process.env.ENABLE_CAD_USER, true);
}

export function isAdminOnlyUserManagementEnabled() {
  return parseBooleanEnvValue(process.env.ENABLE_CAD_USER_ADMIN, true);
}
