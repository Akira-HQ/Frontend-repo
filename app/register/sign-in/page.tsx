"use client";
import React, { useState } from "react";
import { User, Lock, Zap } from "lucide-react";
import { useAppContext } from "@/components/AppContext";
import { UseAPI } from "@/components/hooks/UseAPI";
import { PrimaryButton } from "@/components/Button";
import { validatePassword } from "@/components/hooks/validatePassword";
import { InputField } from "@/components/functions/Helper";
import { ClivaStarsBackground } from "@/components/Stars";
import { useRouter } from "next/navigation";

const LoginContent: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordErrors, setPasswordErrors] = useState(validatePassword(""));
  const [loading, setLoading] = useState<boolean>(false);

  const { addToast, setUser, setAlertMessage, syncQuotas } = useAppContext();
  const router = useRouter();
  const { callApi } = UseAPI();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordErrors(validatePassword(newPassword));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage("", null);
    setLoading(true);

    try {
      if (!email || !password) {
        const errorMsg = "Email and password are required.";
        setAlertMessage(errorMsg, "error");
        addToast(errorMsg, "error");
        setLoading(false);
        return;
      }

      setAlertMessage("Authenticating with Cliva...", "loading");

      const response = await callApi("/user/login", "POST", {
        email,
        password,
      });

      if (!response.token) {
        throw new Error("Authentication failed: No token received.");
      }

      localStorage.setItem("token", response.token);

      const userData = response.data;
      const { onboarding_step, plan, store, is_paid } = userData;

      setUser(userData);

      // ⚡️ UPDATED GATING LOGIC: Match AuthGuard behavior ⚡️

      // 1. Check for Store Connection
      // Only redirect if they haven't completed onboarding and store is missing
      if (onboarding_step !== "COMPLETED" && (!store || !store.is_authorized)) {
        addToast("Step 2: Connect your Shopify store to activate Cliva.", "info");
        router.push("/register?step=connect-store");
        return;
      }

      // 2. Check for Payment Wall
      // Skip if FREE. 
      // If PAID plan: Only redirect if is_paid is false AND they are explicitly at the PAYMENT_WALL step.
      const isFreeUser = plan?.toUpperCase().trim() === 'FREE';
      if (!isFreeUser && is_paid === false && onboarding_step === "PAYMENT_WALL") {
        addToast("Almost there! Please finalize your subscription.", "info");
        router.push(`/register/payment-wall?plan=${plan}&store=${store?.url || ""}`);
        return;
      }

      // ⚡️ 3. FINAL SUCCESS PATH ⚡️
      // If they are COMPLETED or is_paid is true, they go straight to Dashboard
      await syncQuotas();

      setAlertMessage("Identity verified. Entering dashboard...", "success");
      addToast("Welcome back!", "success");

      router.push("/dashboard?view=ai-training");

    } catch (error: any) {
      console.error("Login error:", error);
      const errorMsg = error.message || "Invalid credentials.";
      setAlertMessage(errorMsg, "error");
      addToast(errorMsg, "error");
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignIn}
      className="w-full max-w-lg p-6 sm:p-8 space-y-6 bg-gray-900/80 rounded-3xl border border-gray-800 backdrop-blur-md shadow-2xl shadow-purple-500/20 relative z-10 mx-auto transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-6 tracking-tight">
        Welcome Back
      </h1>

      <div className="space-y-4">
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={User}
          placeholder="user@example.com"
        />

        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          icon={Lock}
          placeholder="Enter your password"
        />
      </div>

      <div className="flex justify-end pt-1">
        <a href="/register/forgot-password" title="reset password" className="text-sm text-[#00A7FF] hover:underline">
          Forgot Password?
        </a>
      </div>

      <PrimaryButton
        type="submit"
        className="mt-5 w-full font-bold tracking-wide shadow-lg active:scale-95 transition-transform"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 animate-pulse text-amber-500" />
            <span>Verifying...</span>
          </span>
        ) : (
          "Sign In"
        )}
      </PrimaryButton>

      <p className="text-center text-gray-400 pt-2 text-sm">
        New here?{" "}
        <a href="/register" className="text-[#A500FF] font-semibold hover:underline">
          Create an Account
        </a>
      </p>
    </form>
  );
};

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen font-inter bg-[#050505] antialiased overflow-x-hidden relative flex items-center justify-center p-4">
      <ClivaStarsBackground density={200} />
      <div className="py-12 w-full max-w-xl">
        <LoginContent />
      </div>
    </div>
  );
};

export default LoginPage;