import React, { createContext, useContext, useState, useEffect } from "react";
import {
  redirectToZoho,
  consumePendingToken,
  saveToken,
  loadToken,
  clearToken,
} from "@/utils/zohoAuth";
import { Users, CRMUser } from "@/utils/zohoCRM";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  crmUser: CRMUser | null;
  accessToken: string | null;
  loginWithZoho: () => void;
  loginDemo: (phone: string, password: string) => Promise<boolean>;
  loginAsVolunteer: () => void;
  loginWithPhone: (phone: string) => Promise<boolean>;
  logout: () => void;
  authError: string;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  crmUser: null,
  accessToken: null,
  loginWithZoho: () => {},
  loginDemo: async () => false,
  loginAsVolunteer: () => {},
  loginWithPhone: async () => false,
  logout: () => {},
  authError: "",
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [crmUser, setCrmUser] = useState<CRMUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    async function init() {
      // 1. Fresh login — token just arrived in URL hash
      const hashToken = consumePendingToken();
      if (hashToken) {
        await saveToken(hashToken);
        setAccessToken(hashToken);
        await fetchCurrentUser();
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // 2. Existing session — token in secure storage
      const stored = await loadToken();
      if (stored) {
        setAccessToken(stored);
        await fetchCurrentUser();
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    }

    init();
  }, []);

  async function fetchCurrentUser() {
    try {
      const res = await Users.me();
      if (res?.users?.[0]) {
        setCrmUser(res.users[0]);
      }
    } catch (e) {
      // Non-fatal — app still works without user details
      console.warn("Could not fetch CRM user:", e);
    }
  }

  const loginWithZoho = () => {
    setAuthError("");
    redirectToZoho();
  };

  const loginDemo = async (phone: string, password: string): Promise<boolean> => {
    if (phone.trim().length >= 10 && password.trim().length >= 4) {
      setCrmUser({ id: "demo", full_name: "Demo User", email: phone + "@demo.com" });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const loginAsVolunteer = () => {
    setCrmUser({ id: "volunteer", full_name: "Tamil Volunteer", email: "volunteer@anna.in" });
    setIsAuthenticated(true);
  };

  const loginWithPhone = async (phone: string): Promise<boolean> => {
    if (phone.trim().length >= 10) {
      setCrmUser({ id: "supporter_" + phone, full_name: "Supporter", email: phone + "@anna.in" });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await clearToken();
    setIsAuthenticated(false);
    setCrmUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, crmUser, accessToken, loginWithZoho, loginDemo, loginAsVolunteer, loginWithPhone, logout, authError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
