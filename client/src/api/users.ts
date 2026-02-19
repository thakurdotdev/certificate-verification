import api from "@/lib/axios";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface StudentUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  rollNo?: string;
  departmentId?: { _id: string; name: string };
  isActive: boolean;
  createdAt: string;
}

export const getAllStudents = async () => {
  const { data } = await api.get<ApiResponse<StudentUser[]>>("/api/users");
  return data.data;
};

export const getAllFaculty = async () => {
  const { data } = await api.get<ApiResponse<StudentUser[]>>("/api/users/faculty");
  return data.data;
};

export const createUser = async (payload: {
  name: string;
  email: string;
  rollNo?: string;
  departmentId?: string;
  role: string;
  password?: string;
}) => {
  const { data } = await api.post<ApiResponse<StudentUser>>("/api/users", payload);
  return data.data;
};

export const updateUser = async (
  id: string,
  payload: { name?: string; departmentId?: string; isActive?: boolean }
) => {
  const { data } = await api.patch<ApiResponse<StudentUser>>(`/api/users/${id}`, payload);
  return data.data;
};
