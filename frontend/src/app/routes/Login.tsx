import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../hooks/appHooks";
import { fetchUserProfile } from "../../features/user/userSlice";
import api from "../../lib/api";
import axios from "axios";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/auth/login", { email, password });
      await dispatch(fetchUserProfile()).unwrap();
      navigate("/dashboard");
    } catch (err) {
      let msg = "Unexpected error";
      if (axios.isAxiosError(err)) {
        msg = err.response?.data?.message || err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{ p: 4, mt: 8 }}
      >
        <Typography
          variant="h4"
          gutterBottom
        >
          Campus Lost & Found
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
        >
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2 }}
        >
          <TextField
            label="Email"
            fullWidth
            required
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            fullWidth
            required
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <Alert
              severity="error"
              sx={{ mt: 2 }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 3, position: "relative" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Login
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  mt: "-12px",
                  ml: "-12px",
                }}
              />
            )}
          </Box>
        </Box>
        <Link
          sx={{ mt: 2, display: "block" }}
          component={RouterLink}
          to="/register"
        >
          Sign Up
        </Link>
      </Paper>
    </Container>
  );
}
