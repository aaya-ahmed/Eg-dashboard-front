import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}`,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const res = await fetch("/api/token", { method: "GET" });
      const data = await res.json();
      console.log(data)
      if (data?.token?.value) {
        config.headers.Authorization = `Bearer ${data.token.value}`;
      }
    } catch (err) {
      console.error("Failed to fetch token", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await fetch("/api/logout", { method: "Post" });
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
