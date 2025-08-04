import { Box, Typography, Paper } from "@mui/material";
import { useAppSelector } from "../../hooks/appHooks";
import ItemList from "../../components/ItemList";
export default function DashboardPage() {
  const user = useAppSelector((state) => state.user.user);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Paper sx={{ mt: 3, p: 2 }}>
        {user ? (
          <>
            <Typography variant="h6">
              Welcome, {user.firstName} {user.lastName}!
            </Typography>
          </>
        ) : (
          <Typography>Loading user info...</Typography>
        )}
      </Paper>
      <ItemList />
    </Box>
  );
}
