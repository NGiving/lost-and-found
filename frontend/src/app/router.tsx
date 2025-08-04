import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Dashboard from "./routes/Dashboard";
import { useAppSelector } from "../hooks/appHooks";
import type { RootState } from "../stores";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, status } = useAppSelector(
    (state: RootState) => state.user
  );

  if (status === "loading" || (status === "idle" && !user)) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
