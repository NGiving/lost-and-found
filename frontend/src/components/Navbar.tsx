import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

type NavbarProps = {
  onLogout: () => void;
  isOpen: boolean;
  toggleDrawer: (isOpen: boolean) => void;
};

export default function Navbar({
  onLogout,
  isOpen,
  toggleDrawer,
}: NavbarProps) {
  return (
    <AppBar
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, position: "fixed" }}
    >
      <Toolbar>
        <IconButton
          onClick={() => toggleDrawer(!isOpen)}
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
        >
          Lost & Found
        </Typography>
        <Button
          color="inherit"
          onClick={onLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
