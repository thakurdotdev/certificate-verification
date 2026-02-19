import api from "@/lib/axios";
import type { Subject } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getSubjects = async () => {
  const { data } = await api.get<ApiResponse<Subject[]>>("/api/subjects");
  return data.data;
};

export const createSubject = async (payload: {
  name: string;
  subjectCode: string;
  departmentId: string;
}) => {
  const { data } = await api.post<ApiResponse<Subject>>("/api/subjects", payload);
  return data.data;
};
