const normalizeApiBase = (value) => {
  const raw = value?.trim();
  if (!raw) return "/api";

  return raw.endsWith("/api") ? raw : `${raw.replace(/\/$/, "")}/api`;
};

const API_BASE = normalizeApiBase(
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
);

export const API_ROOT = API_BASE.replace(/\/api\/?$/, "");

export const filesApiUrl = (path) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
};

export { API_BASE };
