import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { loginApi, registerApi } from "@/api/auth";
import { getMyProfile } from "@/api/users";
import type { User, Role } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: Role | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapProfile = (profile: any): User => ({
  id: profile._id || profile.id,
  name: profile.name,
  email: profile.email,
  role: profile.role as Role,
  rollNo: profile.rollNo,
  departmentId: profile.departmentId?._id || profile.departmentId,
  phone: profile.phone,
  alternateEmail: profile.alternateEmail,
  gender: profile.gender as User["gender"],
  profileImage: profile.profileImage,
  semester: profile.semester,
  grNo: profile.grNo,
  dob: profile.dob,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await getMyProfile();
      setUser(mapProfile(profile));
    } catch {
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token, fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginApi(email, password);
    localStorage.setItem("token", result.token);
    setToken(result.token);
    setUser(mapProfile(result.user));
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const result = await registerApi(email, password);
    localStorage.setItem("token", result.token);
    setToken(result.token);
    setUser(mapProfile(result.user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getMyProfile();
      setUser(mapProfile(profile));
    } catch {
      /* handled by interceptor */
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        role: user?.role ?? null,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
