"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../AppContext";
import { UseAPI } from "./UseAPI";
import { Loader } from "../ui/Loader";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, setUser, addToast } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const { callApi } = UseAPI();

  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/register/sign-in");
        return;
      }

      try {
        const response = await callApi("/verify-session");
        console.log("AuthGuard:", response);
        setUser(response.user);
      } catch (error) {
        console.error("Session validation failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!user) {
      verifySession();
    } else {
      setIsLoading(false);
    }
  }, [user, setUser, router, callApi]);

  if (isLoading) {
    return <Loader className="h-24 w-24" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
