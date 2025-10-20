import {
  Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, useTheme, Paper, IconButton, Tooltip, Divider
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import HomeOutlineIcon from '@mui/icons-material/HomeOutlined';
import EventOutlineIcon from '@mui/icons-material/EventOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined';
import ChecklistOutlineIcon from '@mui/icons-material/ChecklistOutlined';
import PaymentsOutlineIcon from '@mui/icons-material/PaymentsOutlined';
import RequestQuoteOutlineIcon from '@mui/icons-material/RequestQuoteOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import BarChartOutlineIcon from '@mui/icons-material/BarChartOutlined';
import SettingsOutlineIcon from '@mui/icons-material/SettingsOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { paths } from '../../routes/paths';
import logo from '../../assets/logo.png';
import { useSidebar } from '../../context/SidebarContext';

type Props = {
  drawerWidth: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
};

const navItems = [
  { label: 'Início', icon: <HomeOutlineIcon />, to: paths.root },
  { label: 'Agenda', icon: <EventOutlineIcon />, to: paths.agenda },
  { label: 'Clientes', icon: <PeopleOutlineIcon />, to: paths.clients },
  { label: 'Tarefas pendentes', icon: <ChecklistOutlineIcon />, to: paths.tasks },
  { label: 'Pagamentos', icon: <PaymentsOutlineIcon />, to: paths.payments },
  { label: 'Orçamentos', icon: <RequestQuoteOutlineIcon />, to: paths.quotes },
  { label: 'Usuários', icon: <PersonOutlineIcon />, to: paths.users },
  { label: 'Relatórios', icon: <BarChartOutlineIcon />, to: paths.reports },
  { label: 'Configurações', icon: <SettingsOutlineIcon />, to: paths.settings },
];

function NavList({ onItemClick, collapsed }: { onItemClick?: () => void; collapsed?: boolean }) {
  const { pathname } = useLocation();
  const nav = useNavigate();
  const theme = useTheme();

  return (
    <List sx={{ px: collapsed ? 1 : 1.5, py: 0.5, flex: 1, overflow: 'auto' }}>
      {navItems.map(({ label, icon, to }) => {
        const selected = (to === paths.root && pathname === '/') || pathname === to;

        const button = (
          <ListItemButton
            key={to}
            selected={selected}
            onClick={() => {
              nav(to);
              onItemClick?.();
            }}
            sx={{
              my: 0.25,
              minHeight: 44,
              borderRadius: collapsed ? 1.5 : 2,
              px: collapsed ? 0 : 1.5,
              justifyContent: collapsed ? 'center' : 'flex-start',
              bgcolor: selected ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              color: selected ? theme.palette.primary.main : theme.palette.text.secondary,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: selected 
                  ? alpha(theme.palette.primary.main, 0.15) 
                  : alpha(theme.palette.action.hover, 0.10),
              },
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: collapsed ? 0 : 40, 
                justifyContent: 'center',
                color: 'inherit',
              }}
            >
              {icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: selected ? 600 : 500,
                }}
              />
            )}
          </ListItemButton>
        );

        return collapsed ? (
          <Tooltip key={to} title={label} placement="right" arrow>
            {button}
          </Tooltip>
        ) : button;
      })}
    </List>
  );
}

export default function AppSidebar({
  drawerWidth,
  mobileOpen = false,
  onCloseMobile,
}: Props) {
  const theme = useTheme();
  const { collapsed, toggleCollapsed } = useSidebar();
  const collapsedWidth = 64;
  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  const content = (
    <Box 
      sx={{ 
        height: '100vh',
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: 64,
          flexShrink: 0,
        }}
      >
        {collapsed ? (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: theme.palette.primary.main,
              display: 'grid',
              placeItems: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            D
          </Box>
        ) : (
          <>
            <img 
              src={logo} 
              alt="Logo" 
              style={{ 
                height: 32,
                maxWidth: '70%',
                objectFit: 'contain',
              }} 
            />
            <IconButton
              onClick={toggleCollapsed}
              size="small"
              sx={{
                display: { xs: 'none', md: 'flex' },
                '&:hover': {
                  bgcolor: alpha(theme.palette.action.hover, 0.5),
                },
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Box>

      {collapsed && (
        <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', pb: 1, flexShrink: 0 }}>
          <IconButton
            onClick={toggleCollapsed}
            size="small"
            sx={{
              '&:hover': {
                bgcolor: alpha(theme.palette.action.hover, 0.5),
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Divider sx={{ flexShrink: 0 }} />

      {/* Navigation */}
      <NavList onItemClick={onCloseMobile} collapsed={collapsed} />
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
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
            bgcolor: '#FFFFFF',
            borderRight: (t) => `1px solid ${t.palette.divider}`,
          },
        }}
      >
        {content}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        PaperProps={{ elevation: 0 }}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: currentWidth,
            boxSizing: 'border-box',
            borderRight: (t) => `1px solid ${t.palette.divider}`,
            bgcolor: '#FFFFFF',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}