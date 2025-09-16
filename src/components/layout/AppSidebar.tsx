import {
  Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, useTheme,
  Paper
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
import { useLocation, useNavigate } from 'react-router-dom';
import { paths } from '../../routes/paths';
import logo from '../../assets/logo.png';

type Props = {
  drawerWidth: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
};

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
  return null; // coloque seu logo aqui se quiser
}

function NavList({ onItemClick }: { onItemClick?: () => void }) {
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
            selected={selected}
            onClick={() => {
              nav(to);
              onItemClick?.(); // fecha o drawer mobile
            }}
            disableRipple
            sx={{
              position: 'relative',                 // necessário pro ::before
              my: 0.5,
              height: 48,
              borderRadius: 999,
              pl: 1.25,
              pr: 1.5,
              bgcolor: pillBg,
              transition: 'background-color .15s ease',
              '&::before': {
                content: '""',
                position: 'absolute',               // e absolute aqui
                left: 6,
                top: 10,
                bottom: 10,
                width: 4,
                borderRadius: 2,
                backgroundColor: leftBar,
              },
              '&:hover': {
                bgcolor: selected ? alpha(theme.palette.primary.main, 0.18) : 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 44 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: iconBg,
                  color: iconColor,
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
                    color: selected ? 'primary.main' : 'text.primary',
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

export default function AppSidebar({
  drawerWidth,
  mobileOpen = false,
  onCloseMobile,
}: Props) {
  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={0} sx={{ bgcolor: '#fff', border: 'none' }}>
        <img src={logo} alt="Logo da empresa" width={180} style={{ display: 'block', margin: '0 auto' }} />
      </Paper>
      <Brand />
      <NavList onItemClick={onCloseMobile} />
      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ elevation: 0 }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: '#FFFFFF',
          },
        }}
      >
        {content}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        PaperProps={{ elevation: 0 }}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: '#FFFFFF',
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}
