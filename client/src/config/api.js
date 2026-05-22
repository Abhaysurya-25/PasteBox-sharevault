const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:6600/api";

export const API_ROOT = API_BASE.replace(/\/api\/?$/, "");

export const filesApiUrl = (path) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}/files${normalized}`;
};
