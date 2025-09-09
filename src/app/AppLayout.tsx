import { Box, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import AppSidebar from '../components/layout/AppSidebar';
import AppTopbar from '../components/layout/AppTopbar';
import { useState } from 'react';

export default function AppLayout() {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <AppTopbar drawerWidth={drawerWidth} />
      <IconButton
        onClick={() => setMobileOpen(true)}
        sx={{ position: 'fixed', top: 18, left: 12, display: { md: 'none' } }}
      >
        <MenuIcon />
      </IconButton>

      <AppSidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
