import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router";

type SidebarDrawerProps = {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
};

export default function SidebarDrawer({
  open,
  toggleDrawer,
}: SidebarDrawerProps) {
  const navigate = useNavigate();
  const drawerWidth = 240;

  return (
    <Drawer
      open={open}
      onClose={() => toggleDrawer(false)}
      variant="temporary"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate("/my-reports")}>
            <ListItemText primary="My Reports" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
