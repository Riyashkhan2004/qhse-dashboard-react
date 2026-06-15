import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1565C0',
      light: '#1E88E5',
      dark: '#0D47A1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0288D1',
      light: '#29B6F6',
      dark: '#01579B',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2E7D32',
      light: '#43A047',
      dark: '#1B5E20',
    },
    warning: {
      main: '#F57C00',
      light: '#FFA726',
      dark: '#E65100',
    },
    error: {
      main: '#C62828',
      light: '#EF5350',
      dark: '#B71C1C',
    },
    info: {
      main: '#0277BD',
      light: '#29B6F6',
      dark: '#01579B',
    },
    background: {
      default: '#EEF4FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0D1F3C',
      secondary: '#456085',
      disabled: '#90A4AE',
    },
    divider: 'rgba(21, 101, 192, 0.12)',
  },

  typography: {
    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.01em', color: '#0D1F3C' },
    h2: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.01em', color: '#0D1F3C' },
    h3: { fontWeight: 600, fontSize: '1.75rem', color: '#0D1F3C' },
    h4: { fontWeight: 600, fontSize: '1.5rem', color: '#0D1F3C' },
    h5: {
      fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.03em',
      textTransform: 'uppercase' as const, color: '#1565C0',
    },
    h6: {
      fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.06em',
      textTransform: 'uppercase' as const, color: '#456085',
    },
    subtitle1: { fontWeight: 500, fontSize: '0.95rem', color: '#456085' },
    subtitle2: {
      fontWeight: 600, fontSize: '0.78rem', letterSpacing: '0.05em',
      textTransform: 'uppercase' as const, color: '#90A4AE',
    },
    body1: { fontSize: '0.92rem', lineHeight: 1.65, color: '#0D1F3C' },
    body2: { fontSize: '0.83rem', lineHeight: 1.55, color: '#456085' },
    caption: { fontSize: '0.72rem', letterSpacing: '0.04em', color: '#78909C' },
    overline: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', color: '#90A4AE' },
  },

  shape: { borderRadius: 8 },

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
          background-color: #EEF4FB;
          // background-image:
          min-height: 100vh;
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #EEF4FB; }
        ::-webkit-scrollbar-thumb { background: #BBDEFB; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #1565C0; }
      `,
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #0D47A1 0%, #1565C0 60%, #1976D2 100%)',
          boxShadow: '0 2px 12px rgba(13,71,161,0.22)',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#FFFFFF',
          borderRight: '1px solid rgba(21,101,192,0.1)',
          boxShadow: '4px 0 20px rgba(21,101,192,0.07)',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(21,101,192,0.08)',
          borderRadius: 10,
          boxShadow: '0 2px 8px rgba(21,101,192,0.08), 0 1px 3px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(21,101,192,0.14)',
            borderColor: 'rgba(21,101,192,0.2)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(21,101,192,0.07)',
          paddingBottom: '14px',
          background: 'linear-gradient(180deg, rgba(21,101,192,0.025) 0%, transparent 100%)',
        },
        title: {
          fontWeight: 700,
          fontSize: '0.88rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: '#0D1F3C',
        },
        subheader: {
          fontSize: '0.76rem',
          color: '#78909C',
          marginTop: '2px',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.06em',
          fontSize: '0.76rem',
          transition: 'all 0.2s ease',
          padding: '7px 18px',
        },
        contained: {
          background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
          boxShadow: '0 3px 10px rgba(21,101,192,0.28)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
            boxShadow: '0 5px 16px rgba(21,101,192,0.4)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(21,101,192,0.35)',
          color: '#1565C0',
          '&:hover': {
            borderColor: '#1565C0',
            backgroundColor: 'rgba(21,101,192,0.06)',
          },
        },
        text: {
          color: '#456085',
          '&:hover': {
            backgroundColor: 'rgba(21,101,192,0.06)',
            color: '#1565C0',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 7,
            backgroundColor: '#FAFCFF',
            '& fieldset': {
              borderColor: 'rgba(21,101,192,0.2)',
              transition: 'border-color 0.2s ease',
            },
            '&:hover fieldset': { borderColor: 'rgba(21,101,192,0.45)' },
            '&.Mui-focused fieldset': { borderColor: '#1565C0', borderWidth: '1.5px' },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500, fontSize: '0.88rem', color: '#456085',
            '&.Mui-focused': { color: '#1565C0' },
          },
          '& .MuiInputBase-input': { fontSize: '0.9rem', color: '#0D1F3C' },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 7 },
        icon: { color: '#90A4AE' },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.88rem',
          '&:hover': { backgroundColor: 'rgba(21,101,192,0.06)' },
          '&.Mui-selected': {
            backgroundColor: 'rgba(21,101,192,0.1)',
            fontWeight: 600,
            color: '#1565C0',
            '&:hover': { backgroundColor: 'rgba(21,101,192,0.14)' },
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 7,
          margin: '2px 8px',
          padding: '9px 14px',
          transition: 'all 0.18s ease',
          borderLeft: '3px solid transparent',
          '&:hover': {
            backgroundColor: 'rgba(21,101,192,0.07)',
            '& .MuiListItemIcon-root': { color: '#1565C0' },
            '& .MuiListItemText-primary': { color: '#1565C0' },
          },
          '&.Mui-selected': {
            backgroundColor: '#EBF2FC',
            borderLeft: '3px solid #1565C0',
            '& .MuiListItemIcon-root': { color: '#1565C0' },
            '& .MuiListItemText-primary': { color: '#1565C0', fontWeight: 700 },
            '&:hover': { backgroundColor: '#DCEEFB' },
          },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: { color: '#90A4AE', minWidth: 40, transition: 'color 0.18s ease' },
      },
    },

    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 600, letterSpacing: '0.04em', fontSize: '0.84rem',
         textTransform: 'capitalize', color: '#456085', transition: 'color 0.18s ease',
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
            fontSize: '0.7rem', color: '#456085', backgroundColor: '#F0F6FF',
            borderBottom: '2px solid rgba(21,101,192,0.15)', padding: '11px 16px',
          },
        },
      },
    },

    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            transition: 'background-color 0.14s ease',
            '&:hover': { backgroundColor: 'rgba(21,101,192,0.03)' },
          },
          '& .MuiTableCell-body': {
            fontSize: '0.87rem', color: '#0D1F3C',
            borderBottom: '1px solid rgba(21,101,192,0.07)', padding: '10px 16px',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700, letterSpacing: '0.05em',
          fontSize: '0.68rem', textTransform: 'uppercase', borderRadius: 5,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.76rem', backgroundColor: '#0D47A1',
          boxShadow: '0 4px 14px rgba(13,71,161,0.25)', borderRadius: 5,
        },
        arrow: { color: '#0D47A1' },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: 'rgba(21,101,192,0.1)' } },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#78909C',
          transition: 'all 0.18s ease',
          '&:hover': { color: '#1565C0', backgroundColor: 'rgba(21,101,192,0.08)' },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', backgroundColor: '#FFFFFF' },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 7, border: '1px solid', fontSize: '0.86rem' },
        standardInfo: { backgroundColor: '#E3F2FD', borderColor: 'rgba(21,101,192,0.25)', color: '#0D47A1' },
        standardSuccess: { backgroundColor: '#E8F5E9', borderColor: 'rgba(46,125,50,0.25)', color: '#2E7D32' },
        standardWarning: { backgroundColor: '#FFF3E0', borderColor: 'rgba(245,124,0,0.3)', color: '#E65100' },
        standardError: { backgroundColor: '#FFEBEE', borderColor: 'rgba(198,40,40,0.25)', color: '#C62828' },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 3, height: 6, backgroundColor: 'rgba(21,101,192,0.1)' },
        bar: { borderRadius: 3 },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
          fontSize: '0.78rem', color: '#78909C',
          '&.Mui-selected': { color: '#1565C0' },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: '#1565C0', height: 2, borderRadius: 2 },
      },
    },
  },
});

export default theme;