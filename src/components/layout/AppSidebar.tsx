import {
    Drawer, Toolbar, Box, List, ListItemButton, ListItemIcon, ListItemText,
    Typography, Divider, Stack, useTheme
  } from '@mui/material';
  import { alpha } from '@mui/material/styles';
  import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
  import EventRoundedIcon from '@mui/icons-material/EventRounded';
  import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
  import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
  import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
  import RequestQuoteRoundedIcon from '@mui/icons-material/RequestQuoteRounded';
  import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
  import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
  import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
  import DirectionsCarFilledOutlinedIcon from '@mui/icons-material/DirectionsCarFilledOutlined';
  import { useLocation, useNavigate } from 'react-router-dom';
  import { paths } from '../../routes/paths';
  
  type Props = { drawerWidth: number; mobileOpen?: boolean; onCloseMobile?: () => void; };
  
  const navItems = [
    { label: 'Início', icon: <HomeRoundedIcon />, to: paths.root },
    { label: 'Agenda', icon: <EventRoundedIcon />, to: paths.agenda },
    { label: 'Clientes', icon: <PeopleRoundedIcon />, to: paths.clients },
    { label: 'Tarefas pendentes', icon: <ChecklistRoundedIcon />, to: paths.tasks },
    { label: 'Pagamentos', icon: <PaymentsRoundedIcon />, to: paths.payments },
    { label: 'Orçamentos', icon: <RequestQuoteRoundedIcon />, to: paths.quotes },
    { label: 'Usuários', icon: <PersonRoundedIcon />, to: paths.users },
    { label: 'Relatórios', icon: <BarChartRoundedIcon />, to: paths.reports },
    { label: 'Configurações', icon: <SettingsRoundedIcon />, to: paths.settings },
  ];
  
  function Brand() {
    return (
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1 }}>
        <Box
          sx={{
            width: 28, height: 28, borderRadius: 1.2,
            bgcolor: 'primary.main', color: '#fff',
            display: 'grid', placeItems: 'center'
          }}
        >
          <DirectionsCarFilledOutlinedIcon fontSize="small" />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: .2 }}>
          DRIVEON
        </Typography>
      </Stack>
    );
  }
  
  function NavList() {
    const { pathname } = useLocation();
    const nav = useNavigate();
    const theme = useTheme();
  
    return (
      <List sx={{ px: 1.25, py: 1 }}>
        {navItems.map(({ label, icon, to }) => {
          const selected = (to === paths.root && pathname === '/') || pathname === to;
          const pillBg = selected ? alpha(theme.palette.primary.main, 0.12) : 'transparent';
          const leftBar = selected ? theme.palette.primary.main : 'transparent';
          const iconBg = selected ? theme.palette.primary.main : alpha(theme.palette.text.secondary, 0.08);
          const iconColor = selected ? '#fff' : theme.palette.text.secondary;
  
          return (
            <ListItemButton
              key={to}
              onClick={() => nav(to)}
              selected={selected}
              sx={{
                my: .5,
                height: 48,
                borderRadius: 999,              // pílula
                pl: 1.25,
                pr: 1.5,
                position: 'relative',
                bgcolor: pillBg,
                transition: 'background-color .15s ease',
                '&::before': {                   // faixa roxa à esquerda
                  content: '""',
                  position: 'absolute',
                  left: 6,
                  top: 10,
                  bottom: 10,
                  width: 4,
                  borderRadius: 2,
                  backgroundColor: leftBar,
                },
                '&:hover': {
                  bgcolor: selected ? alpha(theme.palette.primary.main, 0.18) : 'action.hover'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 44 }}>
                <Box
                  sx={{
                    width: 28, height: 28, borderRadius: '50%',
                    display: 'grid', placeItems: 'center',
                    bgcolor: iconBg, color: iconColor
                  }}
                >
                  {icon}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: selected ? 700 : 500,
                      color: selected ? 'primary.main' : 'text.primary'
                    }}
                  >
                    {label}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    );
  }
  
  export default function AppSidebar({ drawerWidth, mobileOpen, onCloseMobile }: Props) {
    const content = (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Toolbar sx={{ minHeight: 72 }} />
        <Brand />
        <Divider />
        <NavList />
        {/* espaço em branco no fim para respirar, igual ao mock */}
        <Box sx={{ flexGrow: 1 }} />
      </Box>
    );
  
    return (
      <>
        <Drawer
          variant="temporary"
          open={Boolean(mobileOpen)}
          onClose={onCloseMobile}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
          }}
        >
          {content}
        </Drawer>
  
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid #eee',
              bgcolor: '#FFFFFF'
            }
          }}
        >
          {content}
        </Drawer>
      </>
    );
  }
  