import api from "@/lib/axios";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UserResponse = any;

export const getAllStudents = async () => {
  const { data } = await api.get<ApiResponse<UserResponse[]>>("/api/users");
  return data.data;
};

export const getAllFaculty = async () => {
  const { data } = await api.get<ApiResponse<UserResponse[]>>("/api/users/faculty");
  return data.data;
};

export const createUser = async (formData: FormData) => {
  const { data } = await api.post<ApiResponse<UserResponse>>("/api/users", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const updateUser = async (id: string, formData: FormData) => {
  const { data } = await api.patch<ApiResponse<UserResponse>>(`/api/users/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const getMyProfile = async () => {
  const { data } = await api.get<ApiResponse<UserResponse>>("/api/users/me");
  return data.data;
};

export const updateMyProfile = async (formData: FormData) => {
  const { data } = await api.patch<ApiResponse<UserResponse>>("/api/users/me", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};
