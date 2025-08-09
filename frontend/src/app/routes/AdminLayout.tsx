import { Box } from "@mui/material";
import Navbar from "../../components/NavBar";
import api from "../../lib/api";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { clearUser } from "../../features/user/userSlice";
import { useAppDispatch } from "../../hooks/appHooks";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [open, setDrawer] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", { withCredentials: true });
      dispatch(clearUser());
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const toggleDrawer = (isOpen: boolean) => {
    setDrawer(isOpen);
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
        mt: 6,
      }}
    >
      <Navbar
        onLogout={handleLogout}
        isOpen={open}
        toggleDrawer={toggleDrawer}
      />
      <Box sx={{ p: 4 }}>{children}</Box>
    </Box>
  );
}
