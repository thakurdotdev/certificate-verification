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
  isAuthenticated: boolean;
  role: Role | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [token, user]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginApi(email, password);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const result = await registerApi(email, password);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getMyProfile();
      const updated: User = {
        id: profile._id || (profile as any).id,
        name: profile.name,
        email: profile.email,
        role: profile.role as Role,
        rollNo: profile.rollNo,
        departmentId: profile.departmentId?._id,
        phone: profile.phone,
        alternateEmail: profile.alternateEmail,
        gender: profile.gender as User["gender"],
        profileImage: profile.profileImage,
        semester: profile.semester,
        grNo: profile.grNo,
        dob: profile.dob,
      };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
    } catch {
      /* handled by interceptor */
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
