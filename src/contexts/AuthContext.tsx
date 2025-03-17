import { createContext } from "react";
import { AuthContextType, AuthProviderProps } from "../types/auth";
import { useAuth } from "../hooks/useAuth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
