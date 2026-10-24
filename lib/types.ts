import type { ResumeData } from "./validators";

export type {
  Certification,
  Education,
  Experience,
  PersonalInfo,
  Project,
  ResumeData,
  ResumeLink,
} from "./validators";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resume extends ResumeData {
  id: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeSummary {
  id: string;
  title: string;
  template: string;
  updatedAt: string;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: ApiFieldError[];
}
