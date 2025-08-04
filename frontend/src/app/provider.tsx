import { Provider as ReduxProvider } from "react-redux";
import { store } from "../stores";
import { useAppDispatch } from "../hooks/appHooks";
import { fetchUserProfile } from "../features/user/userSlice";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface AppProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AppProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return <>{children}</>;
}

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </ReduxProvider>
  );
}
