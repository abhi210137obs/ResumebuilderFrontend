import axios, { type AxiosResponse } from "axios";
import type {
  ApiFailure,
  ApiFieldError,
  ApiSuccess,
  Resume,
  ResumeData,
  ResumeSummary,
  User,
} from "./types";
import type { CreateResumeValues, LoginValues, RegisterValues } from "./validators";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(
  /\/+$/,
  "",
);

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000,
});

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/me", "/auth/logout"];

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler;
  return () => {
    if (unauthorizedHandler === handler) unauthorizedHandler = null;
  };
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? "";
      if (!AUTH_ENDPOINTS.some((endpoint) => url.startsWith(endpoint))) {
        unauthorizedHandler?.();
      }
    }
    return Promise.reject(error);
  },
);

async function unwrap<T>(request: Promise<AxiosResponse<ApiSuccess<T>>>): Promise<T> {
  const response = await request;
  return response.data.data;
}

function isApiFailure(value: unknown): value is ApiFailure {
  return typeof value === "object" && value !== null && "message" in value;
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (isApiFailure(data) && data.message) {
      if (data.errors?.length && data.message === "Validation failed") return data.errors[0].message;
      return data.message;
    }
    if (!error.response) {
      return error.code === "ECONNABORTED"
        ? "The request timed out. Please try again."
        : "Cannot reach the server. Check your connection and try again.";
    }
    return fallback;
  }
  return error instanceof Error && error.message ? error.message : fallback;
}

export function getFieldErrors(error: unknown): ApiFieldError[] {
  if (axios.isAxiosError(error) && isApiFailure(error.response?.data)) {
    return error.response.data.errors ?? [];
  }
  return [];
}

export const authApi = {
  me: () => unwrap<{ user: User }>(api.get("/auth/me")).then((data) => data.user),
  login: (values: LoginValues) =>
    unwrap<{ user: User }>(api.post("/auth/login", values)).then((data) => data.user),
  register: ({ name, email, password }: RegisterValues) =>
    unwrap<{ user: User }>(api.post("/auth/register", { name, email, password })).then(
      (data) => data.user,
    ),
  logout: () => unwrap<{ message: string }>(api.post("/auth/logout")),
};

function filenameFromDisposition(header: unknown) {
  if (typeof header !== "string") return null;
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (encoded) return decodeURIComponent(encoded[1]);
  const plain = /filename="?([^";]+)"?/i.exec(header);
  return plain ? plain[1] : null;
}

function toFilename(title: string) {
  const slug = title
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return `${slug || "resume"}.pdf`;
}

async function parseBlobError(error: unknown) {
  if (axios.isAxiosError(error) && error.response?.data instanceof Blob) {
    try {
      error.response.data = JSON.parse(await error.response.data.text());
    } catch {
      error.response.data = { success: false, message: "Could not generate the PDF." };
    }
  }
  return error;
}

export const resumeApi = {
  list: () => unwrap<ResumeSummary[]>(api.get("/resumes")),
  get: (id: string) => unwrap<Resume>(api.get(`/resumes/${encodeURIComponent(id)}`)),
  create: (values: CreateResumeValues | Partial<ResumeData>) =>
    unwrap<Resume>(api.post("/resumes", values)),
  update: (id: string, values: Partial<ResumeData>) =>
    unwrap<Resume>(api.put(`/resumes/${encodeURIComponent(id)}`, values)),
  remove: (id: string) => unwrap<{ id: string }>(api.delete(`/resumes/${encodeURIComponent(id)}`)),
  duplicate: (id: string) => unwrap<Resume>(api.post(`/resumes/${encodeURIComponent(id)}/duplicate`)),
  downloadPdf: async (id: string, title: string) => {
    let response: AxiosResponse<Blob>;
    try {
      response = await api.get<Blob>(`/resumes/${encodeURIComponent(id)}/pdf`, {
        responseType: "blob",
        timeout: 120000,
      });
    } catch (error) {
      throw await parseBlobError(error);
    }
    const filename = filenameFromDisposition(response.headers["content-disposition"]) ?? toFilename(title);
    const url = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};
