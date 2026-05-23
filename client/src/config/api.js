const DEFAULT_PRODUCTION_API_URL =
  "https://pastebox-sharevault.onrender.com/api";

const normalizeApiBase = (value) => {
  const raw = value?.trim();

  if (!raw) {
    return DEFAULT_PRODUCTION_API_URL;
  }

  if (raw.startsWith("/")) {
    return raw.endsWith("/api") ? raw : `${raw.replace(/\/$/, "")}/api`;
  }

  return raw.endsWith("/api") ? raw : `${raw.replace(/\/$/, "")}/api`;
};

const API_BASE = normalizeApiBase(
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL
);

export const API_ROOT = API_BASE.replace(/\/api\/?$/, "");

export const filesApiUrl = (path) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const filePath = normalized.startsWith("/files/") || normalized === "/files"
    ? normalized
    : `/files${normalized}`;

  return `${API_BASE}${filePath}`;
};

export { API_BASE, DEFAULT_PRODUCTION_API_URL };
