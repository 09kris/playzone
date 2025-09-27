import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

// Optional: intercept failed requests and retry with refreshed token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        await axiosInstance.get("/users/refresh-token"); // refresh both cookies
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
