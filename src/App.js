import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './contexts/AuthContext';

// Styles
import './styles/AdminPortal.css';

// Pages
import Login from './pages/Login';
import EventForm from './pages/EventForm';
import EventList from './pages/EventList';
import Register from './pages/Register'

// Components
import Layout from './components/Layout';

// Create a Neubrutalism theme
const neubrutalistTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0066FF', // Bold blue
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF6B00', // Vibrant orange
      contrastText: '#000000',
    },
    background: {
      default: '#FFFFF2', // Off-white background
      paper: '#FFFFFF',
    },
    error: {
      main: '#FF2D6F', // Bright pink
    },
    warning: {
      main: '#FFD600', // Bright yellow
    },
    info: {
      main: '#02A9EA', // Bright cyan
    },
    success: {
      main: '#00C04B', // Bright green
    },
    text: {
      primary: '#000000',
      secondary: '#222222',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Space Mono', monospace",
    allVariants: {
      letterSpacing: -0.2,
    },
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 800,
    },
    h3: {
      fontWeight: 800,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: -0.3,
    },
  },
  shape: {
    borderRadius: 0, // Square corners for brutalism
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '12px 24px',
          boxShadow: '4px 4px 0px 0px #000000',
          border: '2px solid #000000',
          textTransform: 'none',
          transition: 'all 0.2s',
          position: 'relative',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '6px 6px 0px 0px #000000',
          },
          '&:active': {
            transform: 'translate(2px, 2px)',
            boxShadow: '2px 2px 0px 0px #000000',
          },
        },
        contained: {
          '&.Mui-disabled': {
            backgroundColor: '#E0E0E0',
            color: '#888888',
            border: '2px solid #888888',
            boxShadow: '4px 4px 0px 0px #888888',
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '6px 6px 0px 0px #000000',
          border: '2px solid #000000',
          borderRadius: 0,
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: '8px 8px 0px 0px #000000',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '2px solid #000000',
          borderRadius: 0,
        },
        elevation1: {
          boxShadow: '4px 4px 0px 0px #000000',
        },
        elevation2: {
          boxShadow: '6px 6px 0px 0px #000000',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          backgroundColor: '#FFD600',
          color: '#000000',
          borderBottom: '2px solid #000000',
        },
        body: {
          borderBottom: '1px solid #000000',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
          },
          '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid #000000',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            border: '2px solid #000000',
            boxShadow: '4px 4px 0px 0px #000000',
            transition: 'all 0.2s',
            '&.Mui-focused': {
              transform: 'translate(-2px, -2px)',
              boxShadow: '6px 6px 0px 0px #000000',
            },
            '& fieldset': {
              borderWidth: 0,
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#000000',
          borderWidth: '1px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid #000000',
          backgroundColor: '#FFFFFF',
          fontWeight: 600,
        },
        colorPrimary: {
          backgroundColor: '#0066FF',
          color: '#FFFFFF',
        },
        colorSecondary: {
          backgroundColor: '#FF6B00',
          color: '#000000',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid #000000',
          boxShadow: '4px 4px 0px 0px #000000',
        },
        standardError: {
          backgroundColor: '#FF2D6F',
          color: '#FFFFFF',
        },
        standardWarning: {
          backgroundColor: '#FFD600',
          color: '#000000',
        },
        standardInfo: {
          backgroundColor: '#02A9EA',
          color: '#FFFFFF',
        },
        standardSuccess: {
          backgroundColor: '#00C04B',
          color: '#FFFFFF',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid #000000',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: 8,
          border: '2px solid #000000',
          boxShadow: '6px 6px 0px 0px #000000',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          borderRadius: 0,
          border: '1px solid #000000',
          fontWeight: 700,
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={neubrutalistTheme}>
      <CssBaseline />
      <div className="admin-layout">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />  
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<EventList />} />
            <Route path="events" element={<EventList />} />
            <Route path="events/new" element={<EventForm />} />
            <Route path="events/edit/:id" element={<EventForm />} />
          </Route>
        </Routes>

      </div>
    </ThemeProvider>
  );
}

export default App;