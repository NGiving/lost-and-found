import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Dashboard from "./routes/Dashboard";
import Reports from "./routes/Reports";
import EditItem from "./routes/EditItem";
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
