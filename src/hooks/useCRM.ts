import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

type FetchFn<T> = () => Promise<T>;

interface CRMState<T> {
  data: T | null;
  loading: boolean;
  error: string;
  refresh: () => void;
}

export function useCRM<T>(fetchFn: FetchFn<T>, deps: any[] = []): CRMState<T> {
  const { isAuthenticated, logout } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");
    try {
      const result = await fetchFn();
      setData(result);
    } catch (e: any) {
      if (e.message === "TOKEN_EXPIRED" || e.message === "NOT_AUTHENTICATED") {
        logout();
      } else {
        setError(e.message ?? "Failed to load data");
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, ...deps]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refresh: load };
}
