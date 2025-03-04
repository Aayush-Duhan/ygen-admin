import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  CssBaseline
} from '@mui/material';
import Sidebar, { SidebarToggle } from './Sidebar';

const Layout = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  const handleCloseSidebar = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* Mobile sidebar toggle */}
      <SidebarToggle onClick={handleToggleSidebar} />
      
      {/* Responsive sidebar */}
      <Sidebar open={open} onClose={handleCloseSidebar} />
      
      {/* Main content */}
      <Box
        component="main"
        className="main-content"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: '24px 32px 24px 24px' },
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#FFFFF2',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          overflow: 'auto',
          ml: { xs: 0, md: 0 },
          marginLeft: '0 !important',
          '@media (min-width: 900px)': {
            marginLeft: '0 !important',
          },
          // Hide scrollbars in MUI styling
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          transition: 'margin 0.2s'
        }}
      >
        <div className="content-wrapper" style={{ paddingTop: '24px' }}>
          <Outlet />
        </div>
      </Box>
    </Box>
  );
}

export default Layout;