import {
    AppBar, Toolbar, Typography, Box, Avatar, IconButton, Paper, InputBase, Stack, Divider
  } from '@mui/material';
  import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
  import SearchIcon from '@mui/icons-material/Search';
  import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
  
  export default function AppTopbar({ drawerWidth }: { drawerWidth: number }) {
    return (
        <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
          ml: { xs: 0, md: `${drawerWidth}px` },
          borderBottom: '1px solid #eee',
          bgcolor: 'background.default',
        }}
      >      
        <Toolbar sx={{ minHeight: 72, px: 3 }}>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', px: 2 }}>
            <Paper
              variant="outlined"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: { xs: '100%', sm: 420, md: 520 },
                height: 48,
                borderRadius: '24px',
                bgcolor: '#fff',
              }}
            >
              <SearchIcon sx={{ ml: 1.5 }} />
              <InputBase
                placeholder="Pesquisar clientes"
                inputProps={{ 'aria-label': 'pesquisar clientes' }}
                sx={{ ml: 1, flex: 1 }}
              />
            </Paper>
          </Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 220, justifyContent: 'flex-end' }}>
            <IconButton size="small">
              <NotificationsNoneIcon />
            </IconButton>
  
            <Paper
              variant="outlined"
              sx={{
                px: 1, py: 0.5, borderRadius: 999, display: 'flex', alignItems: 'center', gap: 1.25,
                bgcolor: '#fff'
              }}
            >
              <Avatar src="/avatar-gustavo.jpg" sx={{ width: 32, height: 32 }} />
              <Box sx={{ lineHeight: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, m: 0 }}>Gustavo</Typography>
                <Typography variant="caption" color="text.secondary">Mecânico</Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ mx: .5 }} />
              <KeyboardArrowDownIcon fontSize="small" />
            </Paper>
          </Stack>
        </Toolbar>
      </AppBar>
    );
  }
  