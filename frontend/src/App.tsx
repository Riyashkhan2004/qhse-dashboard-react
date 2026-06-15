import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useLocation,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import {
  InsertChart as ChartIcon,
  Menu as MenuIcon,
  FiberManualRecord as DotIcon,
  Wysiwyg as ObservationIcon,
  FactCheck as MVVIcon,
  Warning as IncidentIcon,
  Assignment as InspectionIcon,
  Download as DownloadIcon,
  Logout as LogoutIcon,
  AssignmentTurnedIn as CorrectiveIcon,
} from '@mui/icons-material';

import theme from './theme';
import WeeklyChartDashboard from './components/WeeklyChartDashboard';
import NMOBB from './components/Tabs/NMOBB';
import MVV from './components/Tabs/MVV';
import Insident from './components/Tabs/Insident';
import Inspection from './components/Tabs/Inspection';
import DownloadReports from './components/Tabs/DownloadReports';
import sinopecLogo from './assets/sinopec.png';
import Corrective from './components/Tabs/Corrective';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

const drawerWidth = 248;

const NavItem: React.FC<{
  text: string;
  icon: React.ReactNode;
  path: string;
  onClose: () => void;
}> = ({ text, icon, path, onClose }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={RouterLink}
        to={path}
        onClick={onClose}
        selected={isActive}
      >
        <ListItemIcon sx={{ color: isActive ? '#1565C0' : '#90A4AE' }}>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
};

const DrawerContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuItems = [
    { text: 'Dashboard',        icon: <ChartIcon fontSize="small" />,       path: '/' },
    { text: 'NMOBB',            icon: <ObservationIcon fontSize="small" />, path: '/nmobb' },
    { text: 'MVV',              icon: <MVVIcon fontSize="small" />,         path: '/mvv' },
    { text: 'Incident',         icon: <IncidentIcon fontSize="small" />,    path: '/incident' },
    { text: 'Inspection',       icon: <InspectionIcon fontSize="small" />,  path: '/inspection' },
    { text: 'Corrective Actions', icon: <CorrectiveIcon fontSize="small" />, path: '/corrective' },
    { text: 'Download Reports', icon: <DownloadIcon fontSize="small" />,    path: '/download-reports' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Blue top accent stripe */}
      <Box sx={{ height: 4, background: 'linear-gradient(90deg, #0D47A1 0%, #1976D2 60%, #29B6F6 100%)' }} />

      {/* Logo / Brand */}
      <Box
        sx={{
          px: 2,
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          background: 'linear-gradient(180deg, rgba(21,101,192,0.04) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(21,101,192,0.08)',
        }}
      >
        <img
          src={sinopecLogo}
          alt="Sinopec Logo"
          style={{
            height: 64,
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      </Box>

      {/* Nav links */}
      <List sx={{ px: 0.5, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <NavItem key={item.text} {...item} onClose={onClose} />
        ))}
      </List>

      {/* Status footer */}
      <Divider />
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          background: 'rgba(21,101,192,0.02)',
        }}
      >
        <DotIcon
          sx={{
            fontSize: 10,
            color: '#2E7D32',
            filter: 'drop-shadow(0 0 4px rgba(46,125,50,0.6))',
            animation: 'pulse 2.5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.45 },
            },
          }}
        />
        <Typography variant="caption" sx={{ color: '#90A4AE', ml: 'auto' }}>
          {user?.username || 'Admin'}
        </Typography>
        <Button
          size="small"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ color: '#90A4AE', fontSize: '0.7rem' }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

/* ── AppBar height token – single source of truth ───────── */
const APP_BAR_HEIGHT = 96; // px — adjust freely here

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// AppContent component - protected layout with sidebar
const AppContent: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── AppBar ───────────────────────────────────── */}
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          height: APP_BAR_HEIGHT,
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1976D2 100%)',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            px: { xs: 2, sm: 3 },
            height: APP_BAR_HEIGHT,
            minHeight: `${APP_BAR_HEIGHT}px !important`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {/* Mobile hamburger */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen((p) => !p)}
            sx={{ mr: 1, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Centred header text block */}
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.25,
            }}
          >
            {/* Line 1 – company name */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.68rem', sm: '0.78rem', md: '0.85rem' },
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#E3F2FD',
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              Branch of Sinopec International Petroleum Service Corporation – K.S.A
            </Typography>

            {/* Line 2 – department */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: '0.68rem', sm: '0.78rem', md: '0.85rem' },
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#BBDEFB',
                textAlign: 'center',
                lineHeight: 1.3,
              }}
            >
              HSE Department – Drilling & Workover Operation
            </Typography>

            {/* Line 3 – product name (largest) */}
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.35rem' },
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                textAlign: 'center',
                lineHeight: 1.4,
                textShadow: '0 1px 4px rgba(0,0,0,0.25)',
                mt: 0.25,
              }}
            >
              Rig Safety QHSE System
            </Typography>
          </Box>
        </Toolbar>

        {/* Subtle bottom divider */}
        <Box sx={{ height: 1, background: 'rgba(255,255,255,0.12)' }} />
      </AppBar>

      {/* ── Sidebar ──────────────────────────────────── */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <DrawerContent onClose={() => setMobileOpen(false)} />
        </Drawer>

        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <DrawerContent onClose={() => {}} />
        </Drawer>
      </Box>

      {/* ── Main content ─────────────────────────────── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          // Push content below the fixed AppBar
          mt: `${APP_BAR_HEIGHT}px`,
        }}
      >
        <Routes>
          <Route path="/"                element={<WeeklyChartDashboard />} />
          <Route path="/nmobb"           element={<NMOBB />} />
          <Route path="/mvv"             element={<MVV />} />
          <Route path="/inspection"      element={<Inspection />} />
          <Route path="/incident"        element={<Insident />} />
          <Route path="/download-reports" element={<DownloadReports />} />
          <Route path="/corrective"      element={<Corrective />} />
        </Routes>
      </Box>
    </Box>
  );
};

// Main App component with routes
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
