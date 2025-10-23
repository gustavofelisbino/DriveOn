import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Paper,
  InputBase,
  Stack,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AppTopbar({ drawerWidth }: { drawerWidth: number }) {
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
    handleMenuClose();
    window.location.href = "/login";
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        ml: { xs: 0, md: `${drawerWidth}px` },
        mt: 1,
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: 3 }}>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center", px: 2 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Olá {user?.nome || "usuário"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 300 }}>
              Bem-vindo de volta!
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: 420, md: 520 },
              height: 48,
              borderRadius: "24px",
            }}
          >
            <SearchIcon sx={{ ml: 1.5 }} />
            <InputBase
              placeholder="Pesquisar clientes"
              inputProps={{ "aria-label": "pesquisar clientes" }}
              sx={{ ml: 1, flex: 1 }}
            />
          </Paper>
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ minWidth: 220, justifyContent: "flex-end" }}
        >
          <IconButton
            size="small"
            sx={{
              bgcolor: "grey.100",
              borderRadius: 999,
              p: 1,
              "&:hover": { bgcolor: "grey.300" },
            }}
          >
            <NotificationsRoundedIcon sx={{ color: "grey.800" }} />
          </IconButton>
          <Paper
            variant="outlined"
            onClick={handleMenuOpen}
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              bgcolor: "#fff",
              cursor: "pointer",
              userSelect: "none",
              "&:hover": { bgcolor: "grey.50" },
            }}
          >
            <Avatar
              src="/avatar-gustavo.jpg"
              sx={{ width: 32, height: 32 }}
              alt={user?.nome || "Usuário"}
            />
            <Box sx={{ lineHeight: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, m: 0 }}>
                {user?.nome || "Usuário"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.tipo || "Cargo"}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
            <KeyboardArrowDownIcon fontSize="small" />
          </Paper>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 2,
                boxShadow: "0px 4px 16px rgba(0,0,0,0.08)",
                minWidth: 180,
              },
            }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutRoundedIcon fontSize="small" />
              </ListItemIcon>
              Sair
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
