import React from "react";
import { User } from "@/types/user";
import { endpoint } from "@/config";

export const useAuth = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const signIn = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${endpoint}/api/auth/signin`, {
        method: "POST",
        credentials: "include", // important for session cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signin failed");
      setLoading(false);
      return data.user; // return user from session
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${endpoint}/api/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      setLoading(false);
      return data.user;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
      return null;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await fetch(`${endpoint}/api/auth/signout`, {
        method: "POST",
        credentials: "include",
      });
      setLoading(false);
    } catch (err: unknown) {
      console.error("Signout error:", err);
      setLoading(false);
    }
  };

  return { loading, error, signIn, signUp, signOut };
};
