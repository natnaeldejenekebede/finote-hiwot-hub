import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// JWT interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fh-jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fh-jwt");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// API endpoints (ready for Golang backend)
export const postsApi = {
  getAll: () => api.get("/posts"),
  getById: (id: string) => api.get(`/posts/${id}`),
  create: (data: Record<string, unknown>) => api.post("/posts", data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
};

export const membersApi = {
  register: (data: Record<string, unknown>) => api.post("/members", data),
  getAll: () => api.get("/members"),
  getById: (id: string) => api.get(`/members/${id}`),
};

export const eventsApi = {
  getAll: () => api.get("/events"),
};

export const authApi = {
  login: (data: { username: string; password: string }) => api.post("/auth/login", data),
};

export default api;
