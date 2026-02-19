import api from "@/lib/axios";
import type { Department } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getDepartments = async () => {
  const { data } = await api.get<ApiResponse<Department[]>>("/api/departments");
  return data.data;
};

export const createDepartment = async (name: string) => {
  const { data } = await api.post<ApiResponse<Department>>("/api/departments", { name });
  return data.data;
};
