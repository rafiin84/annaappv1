import React, { createContext, useContext, useState, useEffect } from "react";
import {
  generatePKCE,
  buildAuthUrl,
  exchangeCode,
  fetchProfile,
  saveVerifier,
  loadVerifier,
  redirectToZoho,
  parseCallbackParams,
  ZohoProfile,
} from "@/utils/zohoAuth";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: ZohoProfile | null;
  loginWithZoho: () => Promise<void>;
  loginDemo: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  authError: string;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  loginWithZoho: async () => {},
  loginDemo: async () => false,
  logout: () => {},
  authError: "",
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<ZohoProfile | null>(null);
  const [authError, setAuthError] = useState("");

  // On mount: check if this is an OAuth callback redirect
  useEffect(() => {
    async function handleCallback() {
      const callback = parseCallbackParams();
      if (!callback) return;

      const stored = loadVerifier();
      if (!stored) return;

      // Validate state to prevent CSRF
      if (stored.state !== callback.state) {
        setAuthError("Authentication failed: state mismatch. Please try again.");
        return;
      }

      setIsLoading(true);
      setAuthError("");
      try {
        const token = await exchangeCode(callback.code, stored.verifier);
        const profile = await fetchProfile(token);
        setUser(profile);
        setIsAuthenticated(true);
      } catch (e: any) {
        setAuthError(e.message ?? "Authentication failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    handleCallback();
  }, []);

  const loginWithZoho = async () => {
    setAuthError("");
    setIsLoading(true);
    try {
      const { verifier, challenge } = await generatePKCE();
      const state = Math.random().toString(36).slice(2);
      saveVerifier(verifier, state);
      const url = buildAuthUrl(challenge, state);
      redirectToZoho(url);
    } catch (e: any) {
      setAuthError(e.message ?? "Failed to start login. Please try again.");
      setIsLoading(false);
    }
  };

  // Demo login (phone + password, no real auth)
  const loginDemo = async (phone: string, password: string): Promise<boolean> => {
    if (phone.trim().length >= 10 && password.trim().length >= 4) {
      setUser({
        ZUID: "demo",
        First_Name: "Demo",
        Last_Name: "User",
        Display_Name: "Demo User",
        Email: phone + "@demo.com",
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, loginWithZoho, loginDemo, logout, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
