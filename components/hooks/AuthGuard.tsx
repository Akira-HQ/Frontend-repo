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
    /**
     * ⚡️ NEURAL GATING LOGIC
     * Determines if the user identity has clearance to access the current view.
     */
    const checkGating = (u: any) => {
      if (!u) return;

      const planName = u.plan?.toUpperCase().trim();
      const isFreeUser = planName === 'FREE';
      const isFounder = u.is_founding_member === true; // ⚡️ FOUNDER STATUS DETECTED
      const storeAuthorized = u.store?.is_authorized === true;
      const step = u.onboarding_step;

      // 1. Force Store Connection: If the pulse isn't linked, they can't enter.
      // Exception: If they've already "Completed" onboarding.
      if (!storeAuthorized && step !== "COMPLETED") {
        router.replace("/register?step=connect-store");
        return false;
      }

      // 2. Handle Payment Wall:
      // Founders skip this because they are on an active trial.
      // Free users skip this because they have no subscription.
      if (!isFreeUser && !isFounder && u.is_paid === false && step === "PAYMENT_WALL") {
        router.replace(`/register/payment-wall?plan=${u.plan}&store=${u.store?.url || ""}`);
        return false;
      }

      // 3. Clearance Granted
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
        if (!response.valid || !response.user) throw new Error("Neural identity mismatch");

        const vUser = response.user;

        // Update global state and run gating check
        setUser(vUser);
        checkGating(vUser);
      } catch (error) {
        console.error("Auth Guard Failure:", error);
        localStorage.removeItem("token");
        router.replace("/register/sign-in");
      }
    };

    // Execution Priority: Check existing user state first, otherwise verify token with server.
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