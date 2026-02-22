export type Role = "STUDENT" | "FACULTY";

export type Gender = "MALE" | "FEMALE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  rollNo?: string;
  departmentId?: string;
  phone?: string;
  alternateEmail?: string;
  gender?: Gender;
  profileImage?: string | null;
  semester?: number;
  grNo?: string;
  dob?: string;
}

export interface Department {
  _id: string;
  name: string;
}

export interface Subject {
  _id: string;
  name: string;
  subjectCode: string;
  departmentId: Department;
}

export interface Certificate {
  _id: string;
  studentId: User;
  name: string;
  title: string;
  description?: string;
  subjectId?: Subject;
  subjectDate?: string;
  fileUrl: string;
  fileType: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  verifiedBy?: User;
  remarks?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
}

export interface StatusHistoryEntry {
  status: string;
  changedBy: User;
  changedAt: string;
  comment?: string;
}
