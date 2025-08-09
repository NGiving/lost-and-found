import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Dashboard from "./routes/Dashboard";
import Reports from "./routes/Reports";
import EditItem from "./routes/EditItem";
import AdminLogin from "./routes/AdminLogin";
import AdminDashboard from "./routes/AdminDashboard";
import { useAppSelector } from "../hooks/appHooks";
import type { RootState } from "../stores";
import NewItem from "./routes/NewItem";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.user
  );

  if (isAuthenticated || user) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }
  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, status } = useAppSelector(
    (state: RootState) => state.user
  );

  if (status === "loading" || (status === "idle" && !user)) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
}

function AdminPublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAppSelector(
    (state: RootState) => state.user
  );

  if (isAuthenticated && user?.role === "ROLE_ADMIN") {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
      />
    );
  }
  return <>{children}</>;
}

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, status } = useAppSelector(
    (state: RootState) => state.user
  );

  if (status === "loading" || (status === "idle" && !user)) {
    return <div>Loading...</div>;
  }

  return isAuthenticated && user?.role === "ROLE_ADMIN" ? (
    <>{children}</>
  ) : (
    <Navigate
      to="/admin/login"
      replace
    />
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reports/new"
          element={
            <ProtectedRoute>
              <NewItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reports/:id/edit"
          element={
            <ProtectedRoute>
              <EditItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/login"
          element={
            <AdminPublicRoute>
              <AdminLogin />
            </AdminPublicRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
