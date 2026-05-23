import axios from "axios";
import { API_BASE } from "./api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Network request failed";

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;