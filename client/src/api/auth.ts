import api from "@/lib/axios";

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: "STUDENT" | "FACULTY" | "ADMIN";
      studentId?: string;
      department?: string;
    };
    token: string;
  };
}

export const loginApi = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return data.data;
};

export const registerApi = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>("/api/auth/register", {
    email,
    password,
  });
  return data.data;
};
