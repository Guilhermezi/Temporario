import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  api,
  clearToken,
  getStoredUser,
  getToken,
  saveToken,
  saveUser,
  type Usuario,
} from "@/lib/api/client";

type AuthContextData = {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const me = await api.auth.me();
      saveUser(me);
      setUser(me);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email: string, senha: string) => {
    setLoading(true);
    try {
      const { token } = await api.auth.login({ email, senha });
      saveToken(token);

      const me = await api.auth.me();
      saveUser(me);
      setUser(me);
    } finally {
      setLoading(false);
    }
  }, []);

  const registrar = useCallback(async (nome: string, email: string, senha: string) => {
    setLoading(true);
    try {
      await api.auth.registrar({ nome, email, senha });

      const { token } = await api.auth.login({ email, senha });
      saveToken(token);

      const me = await api.auth.me();
      saveUser(me);
      setUser(me);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      registrar,
      logout,
      refreshUser,
    }),
    [user, loading, login, registrar, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return context;
}