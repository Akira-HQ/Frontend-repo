"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../AppContext";
import { UseAPI } from "./UseAPI";
import { Loader } from "../ui/Loader";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, setUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const { callApi } = UseAPI();

  useEffect(() => {
    const checkGating = (u: any) => {
      if (!u) return;

      const planName = u.plan?.toUpperCase().trim();
      const isFreeUser = planName === 'FREE';
      const storeAuthorized = u.store?.is_authorized === true;
      const step = u.onboarding_step;

      // 1. Force Store Connection if missing or unauthorized
      if (!storeAuthorized && step !== "COMPLETED") {
        router.replace("/register?step=connect-store");
        return false;
      }

      // 2. Handle Payment Wall
      // If NOT free, and the DB doesn't say they are paid, and they are still in the payment step
      if (!isFreeUser && u.is_paid === false && step === "PAYMENT_WALL") {
        router.replace(`/register/payment-wall?plan=${u.plan}&store=${u.store?.url || ""}`);
        return false;
      }

      // 3. Access Granted: Either they are PAID or they are FREE
      setIsLoading(false);
      return true;
    };

    const verifySession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/register/sign-in");
        return;
      }

      try {
        const response = await callApi("/verify-session");
        if (!response.valid || !response.user) throw new Error("User not found");

        const vUser = response.user;
        setUser(vUser);
        checkGating(vUser);
      } catch (error) {
        console.error("Auth Guard Failure:", error);
        localStorage.removeItem("token");
        router.replace("/register/sign-in");
      }
    };

    if (!user) {
      verifySession();
    } else {
      checkGating(user);
    }
  }, [user, setUser, router, callApi]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader className="h-16 w-16 text-[#A500FF]" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;