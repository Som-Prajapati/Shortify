import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  const backendToken = session?.user?.backendToken;

  if (backendToken) {
    config.headers.Authorization = `Bearer ${backendToken}`;
  }

  return config;
});

export default api;
