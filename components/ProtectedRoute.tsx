"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
      router.push("/login");
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
