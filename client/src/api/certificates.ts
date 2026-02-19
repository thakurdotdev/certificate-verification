import api from "@/lib/axios";
import type { Certificate } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const uploadCertificate = async (formData: FormData) => {
  const { data } = await api.post<ApiResponse<Certificate>>("/api/certificates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const getMyCertificates = async () => {
  const { data } = await api.get<ApiResponse<Certificate[]>>("/api/certificates/my");
  return data.data;
};

export const getPendingCertificates = async () => {
  const { data } = await api.get<ApiResponse<Certificate[]>>("/api/certificates/pending");
  return data.data;
};

export const getAllCertificates = async () => {
  const { data } = await api.get<ApiResponse<Certificate[]>>("/api/certificates/all");
  return data.data;
};

export const getCertificateById = async (id: string) => {
  const { data } = await api.get<ApiResponse<Certificate>>(`/api/certificates/${id}`);
  return data.data;
};

export const updateCertificate = async (id: string, payload: Partial<Certificate>) => {
  const { data } = await api.patch<ApiResponse<Certificate>>(`/api/certificates/${id}`, payload);
  return data.data;
};

export const deleteCertificate = async (id: string) => {
  const { data } = await api.delete<ApiResponse<{ message: string }>>(`/api/certificates/${id}`);
  return data.data;
};

export const verifyCertificate = async (
  id: string,
  payload: { status: "APPROVED" | "REJECTED"; remarks: string }
) => {
  const { data } = await api.post<ApiResponse<Certificate>>(`/api/certificates/${id}/verify`, payload);
  return data.data;
};
