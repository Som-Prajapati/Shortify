import api from "@/lib/api";

export const handleRegister = async (email, password, name) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });
  console.log(response.data);
};

export const handleLogin = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  console.log(response.data);
};

export const handleLogout = async () => {
  const response = await api.get("/auth/logout");
  console.log(response.data);
};
