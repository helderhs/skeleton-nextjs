import { alpha, createTheme } from '@mui/material/styles';
import type { ThemeMode } from '@/types';

export const DEFAULT_THEME_MODE: ThemeMode = 'dark';

const sharedPalette = {
  primary: {
    main: '#6C63FF',
    light: '#8B83FF',
    dark: '#4A42D4',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#00D9A6',
    light: '#33E3BA',
    dark: '#00A882',
    contrastText: '#06251C',
  },
  error: {
    main: '#FF5370',
  },
  warning: {
    main: '#FFB74D',
  },
  info: {
    main: '#64B5F6',
  },
  success: {
    main: '#69F0AE',
  },
} as const;

const paletteByMode: Record<
  ThemeMode,
  {
    background: { default: string; paper: string };
    text: { primary: string; secondary: string };
    divider: string;
  }
> = {
  dark: {
    background: {
      default: '#0A0E1A',
      paper: '#111827',
    },
    text: {
      primary: '#E8ECF4',
      secondary: '#94A3B8',
    },
    divider: 'rgba(148, 163, 184, 0.12)',
  },
  light: {
    background: {
      default: '#F3F6FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#5B6472',
    },
    divider: 'rgba(15, 23, 42, 0.10)',
  },
};

export function getTheme(mode: ThemeMode) {
  const isDark = mode === 'dark';
  const palette = paletteByMode[mode];
  const alertTextColor = {
    error: isDark ? '#FFD7DF' : '#7A1730',
    warning: isDark ? '#FFE1B5' : '#7A4300',
    info: isDark ? '#D7ECFF' : '#0D4A74',
    success: isDark ? '#CBF6DF' : '#165B38',
  } as const;

  return createTheme({
    palette: {
      mode,
      ...sharedPalette,
      ...palette,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 10,
            padding: '10px 24px',
            fontSize: '0.95rem',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.primary.main,
                isDark ? 0.25 : 0.18
              )}`,
            },
            '&.MuiButton-containedPrimary': {
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              },
            },
          }),
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              backgroundColor: isDark
                ? alpha(theme.palette.common.white, 0.03)
                : alpha(theme.palette.common.white, 0.88),
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: isDark
                  ? alpha(theme.palette.common.white, 0.05)
                  : theme.palette.common.white,
              },
              '&.Mui-focused': {
                backgroundColor: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.05 : 0.08
                ),
              },
            },
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            border: `1px solid ${alpha(
              theme.palette.text.secondary,
              isDark ? 0.08 : 0.12
            )}`,
            backdropFilter: 'blur(20px)',
            background: alpha(
              theme.palette.background.paper,
              isDark ? 0.8 : 0.92
            ),
            boxShadow: isDark
              ? `0 12px 40px ${alpha(theme.palette.common.black, 0.24)}`
              : `0 18px 40px ${alpha(theme.palette.primary.main, 0.08)}`,
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: ({ theme }) => ({
            borderRight: `1px solid ${alpha(
              theme.palette.text.secondary,
              isDark ? 0.08 : 0.12
            )}`,
            background: alpha(
              theme.palette.background.paper,
              isDark ? 0.95 : 0.9
            ),
            backdropFilter: 'blur(20px)',
          }),
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            background: alpha(
              isDark
                ? theme.palette.background.default
                : theme.palette.background.paper,
              isDark ? 0.8 : 0.82
            ),
            color: theme.palette.text.primary,
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${alpha(
              theme.palette.text.secondary,
              isDark ? 0.08 : 0.12
            )}`,
            boxShadow: 'none',
          }),
          colorPrimary: ({ theme }) => ({
            background: alpha(
              isDark
                ? theme.palette.background.default
                : theme.palette.background.paper,
              isDark ? 0.8 : 0.82
            ),
            color: theme.palette.text.primary,
          }),
        },
      },
      MuiAlert: {
        variants: [
          {
            props: { variant: 'standard', severity: 'error' },
            style: {
              color: alertTextColor.error,
              backgroundColor: alpha(sharedPalette.error.main, isDark ? 0.14 : 0.12),
              border: `1px solid ${alpha(sharedPalette.error.main, isDark ? 0.28 : 0.24)}`,
              '& .MuiAlert-icon': {
                color: sharedPalette.error.main,
              },
            },
          },
          {
            props: { variant: 'standard', severity: 'warning' },
            style: {
              color: alertTextColor.warning,
              backgroundColor: alpha(
                sharedPalette.warning.main,
                isDark ? 0.14 : 0.16
              ),
              border: `1px solid ${alpha(sharedPalette.warning.main, isDark ? 0.28 : 0.26)}`,
              '& .MuiAlert-icon': {
                color: sharedPalette.warning.main,
              },
            },
          },
          {
            props: { variant: 'standard', severity: 'info' },
            style: {
              color: alertTextColor.info,
              backgroundColor: alpha(sharedPalette.info.main, isDark ? 0.14 : 0.12),
              border: `1px solid ${alpha(sharedPalette.info.main, isDark ? 0.28 : 0.24)}`,
              '& .MuiAlert-icon': {
                color: sharedPalette.info.main,
              },
            },
          },
          {
            props: { variant: 'standard', severity: 'success' },
            style: {
              color: alertTextColor.success,
              backgroundColor: alpha(
                sharedPalette.success.main,
                isDark ? 0.14 : 0.18
              ),
              border: `1px solid ${alpha(sharedPalette.success.main, isDark ? 0.26 : 0.22)}`,
              '& .MuiAlert-icon': {
                color: isDark
                  ? sharedPalette.success.main
                  : sharedPalette.secondary.dark,
              },
            },
          },
        ],
        styleOverrides: {
          root: {
            borderRadius: 12,
            alignItems: 'center',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 10,
            margin: '2px 8px',
            transition: 'all 0.2s ease-in-out',
            '&.Mui-selected': {
              background: alpha(
                theme.palette.primary.main,
                isDark ? 0.15 : 0.1
              ),
              '&:hover': {
                background: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.2 : 0.14
                ),
              },
            },
            '&:hover': {
              background: alpha(
                theme.palette.text.secondary,
                isDark ? 0.08 : 0.06
              ),
            },
          }),
        },
      },
    },
  });
}

const theme = getTheme(DEFAULT_THEME_MODE);

export default theme;
