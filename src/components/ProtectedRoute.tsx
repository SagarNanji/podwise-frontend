import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

export const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuthContext();

  if (!user) return <Navigate to="/signin" replace />; // redirect if not logged in
  return children;
};
