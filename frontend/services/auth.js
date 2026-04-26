import api from "@/lib/api";
import { signIn } from "next-auth/react";

export const handleRegister = async (email, password, name) => {
  await api.post("/auth/register", {
    name,
    email,
    password,
  });

  const loginResult = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (!loginResult || loginResult.error) {
    throw new Error("Registered, but automatic login failed.");
  }
};
