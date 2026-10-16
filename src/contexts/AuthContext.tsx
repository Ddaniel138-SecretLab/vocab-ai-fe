import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/services/auth-api";
import { ApiError, errorMessage } from "@/lib/api-client";
import type { User, Profile, ProfileInput } from "@/types/auth";
interface AuthState {
  user: User | null;
  profile: Profile | null;
  isProfileComplete: boolean;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  login: (
    email: string,
    password: string,
    adminOnly?: boolean,
  ) => Promise<void>;
  register: (email: string, code: string, password: string) => Promise<void>;
  logout: (admin?: boolean) => Promise<void>;
  clearSession: () => void;
  saveProfile: (input: ProfileInput) => Promise<void>;
}
const AuthContext = createContext<AuthState | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProfileComplete, setComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const clear = useCallback(() => {
    generation.current++;
    setUser(null);
    setProfile(null);
    setComplete(false);
    setError("");
  }, []);
  const refresh = useCallback(async () => {
    const version = ++generation.current;
    setLoading(true);
    setError("");
    try {
      const result = await authApi.me();
      const details = await authApi.profile();
      if (version !== generation.current) return;
      setUser(result.user);
      setProfile(details.profile);
      setComplete(details.isProfileComplete);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) clear();
      else if (version === generation.current) setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [clear]);
  useEffect(() => {
    void refresh();
    window.addEventListener("auth:expired", clear);
    return () => window.removeEventListener("auth:expired", clear);
  }, [refresh, clear]);
  async function authenticate(action: () => Promise<{ user: User }>) {
    generation.current++;
    const result = await action();
    setUser(result.user);
    setProfile(null);
    setComplete(false);
    setError("");
    // The login/register screen refreshes the profile after authentication.
  }
  async function saveProfile(input: ProfileInput) {
    const result = await authApi.updateProfile(input);
    setProfile(result.profile);
    setComplete(result.isProfileComplete);
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isProfileComplete,
        loading,
        error,
        refresh,
        login: (email, password, adminOnly = false) =>
          authenticate(() =>
            adminOnly
              ? authApi.adminLogin(email, password)
              : authApi.login(email, password),
          ),
        register: (email, code, password) =>
          authenticate(() => authApi.verifyCode(email, code, password)),
        clearSession: clear,
        logout: async (admin = false) => {
          if (admin) await authApi.adminLogout();
          else await authApi.logout();
          clear();
        },
        saveProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider is missing");
  return value;
}
