import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Divider,
  Drawer,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link } from 'react-router-dom';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

// Logo component
const Logo = () => (
  <Box
    sx={{
      p: 2,
      textAlign: 'center',
      mb: 2
    }}
  >
    <Typography
      variant="h5"
      sx={{
        fontWeight: 800,
        letterSpacing: '-1px',
        display: 'inline-block',
        background: '#FFD600',
        py: 1,
        px: 2,
        border: '3px solid #000',
        boxShadow: '4px 4px 0 #000',
        transform: 'rotate(-1deg)',
        '&:hover': {
          transform: 'rotate(1deg)',
          transition: 'transform 0.3s ease'
        }
      }}
    >
      Code<span style={{ color: '#d60d28' }}>-Y-</span>gen
    </Typography>
  </Box>
);

function Sidebar({ open, onClose }) {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Navigation items
  const navItems = [
    { text: 'Events', icon: <EventIcon />, path: '/events' },
    // Add more navigation items here when needed
  ];

  // Sidebar content
  const sidebarContent = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton 
              onClick={onClose}
              sx={{ 
                borderRadius: 0,
                border: '2px solid #000',
                p: '6px',
                '&:hover': {
                  backgroundColor: '#FF2D6F',
                  color: 'white'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      
        <Logo />
        
        <Divider sx={{ borderColor: '#000', borderWidth: '2px', mx: 2, mb: 3 }} />
        
        <List sx={{ px: 2 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                            (item.path !== '/' && location.pathname.startsWith(item.path));
                            
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 2 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={isMobile ? onClose : undefined}
                  sx={{
                    backgroundColor: isActive ? '#0066FF' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#000000',
                    borderRadius: 0,
                    border: '2px solid #000',
                    boxShadow: '4px 4px 0 0 #000',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: isActive ? '#0066FF' : '#FFD600',
                      transform: 'translate(-2px, -2px)',
                      boxShadow: '6px 6px 0 0 #000',
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isActive ? '#FFFFFF' : '#000000',
                    minWidth: '40px'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: 700,
                      letterSpacing: '-0.5px'
                    }} 
                  />
                  {isActive && (
                    <Box 
                      sx={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: 0,
                        backgroundColor: '#FFD600',
                        border: '2px solid #000',
                        ml: 1
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        
        <Box sx={{ mt: 'auto', p: 2 }}>
          {/* Logout button */}
          <ListItem disablePadding sx={{ mb: 3 }}>
            <Tooltip title="Logout" placement="right">
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  borderRadius: 0,
                  border: '2px solid #000',
                  boxShadow: '4px 4px 0 0 #000',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: theme.palette.error.main,
                    color: '#FFFFFF',
                    transform: 'translate(-2px, -2px)',
                    boxShadow: '6px 6px 0 0 #000',
                  },
                  '&:active': {
                    transform: 'translate(2px, 2px)',
                    boxShadow: '2px 2px 0 0 #000',
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'inherit',
                  minWidth: '40px'
                }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{ 
                    fontWeight: 700,
                    letterSpacing: '-0.5px'
                  }} 
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>

          <Box
            sx={{
              p: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
              border: '2px solid #000',
              borderRadius: 0,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -8,
                left: 20,
                width: 16,
                height: 16,
                backgroundColor: '#FFFFF2',
                transform: 'rotate(45deg)',
                border: '2px solid #000',
                borderBottom: 'none',
                borderRight: 'none',
                zIndex: 1
              }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
              Need help?
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
              Click on an event to see details or create a new event.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );

  // Render permanent sidebar for desktop, temporary drawer for mobile
  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        variant="temporary"
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: '#FFFFF2',
            borderRight: '3px solid #000',
            boxShadow: '5px 0 0 0 #000',
          }
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' }
      }}
    >
      <Box
        sx={{
          width: 280,
          backgroundColor: '#FFFFF2',
          borderRight: '3px solid #000',
          boxShadow: '5px 0 0 0 #000',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1100,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          // Hide scrollbars
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          msOverflowStyle: 'none',  // IE and Edge
          scrollbarWidth: 'none'    // Firefox
        }}
      >
        {sidebarContent}
      </Box>
    </Box>
  );
}

// Menu toggle button component for mobile
export const SidebarToggle = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    aria-label="open menu"
    sx={{
      position: 'fixed',
      top: 16,
      left: 16,
      zIndex: 1090,
      backgroundColor: '#FFFFFF',
      border: '2px solid #000',
      borderRadius: 0,
      boxShadow: '4px 4px 0 0 #000',
      display: { xs: 'flex', md: 'none' },
      p: 1.5,
      '&:hover': {
        backgroundColor: '#FFD600',
        transform: 'translate(-2px, -2px)',
        boxShadow: '6px 6px 0 0 #000',
      }
    }}
  >
    <MenuIcon />
  </IconButton>
);

export default Sidebar; 