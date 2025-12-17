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
        const verifiedUser = response.user;
        setUser(verifiedUser);

        // ⚡ Safety Net: Redirect if they try to access /dashboard without completing steps
        if (verifiedUser.onboardingStep === "CONNECT_STORE") {
          // Use 'connect-store' to match the useEffect logic above
          router.replace("/register?step=connect-store");
        } else if (verifiedUser.onboardingStep === "PAYMENT_WALL") {
          router.replace(`/register/payment-wall?plan=${verifiedUser.plan}&store=${verifiedUser.store?.storeUrl}`);
        }
      } catch (error) {
        console.error("Session validation failed:", error);
        localStorage.removeItem("token");
        router.push("/register/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    if (!user) {
      verifySession();
    } else {
      // Check state even if user object exists in context
      if (user.onboardingStep === "CONNECT_STORE") {
        router.replace("/register?step=connect-store");
      } else if (user.onboardingStep === "PAYMENT_WALL") {
        router.replace(`/register/payment-wall?plan=${user.plan}&store=${user.store?.storeUrl}`);
      }
      setIsLoading(false);
    }
  }, [user, setUser, router, callApi]);

  if (isLoading) {
    return <Loader className="h-24 w-24" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
