"use client";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
// Importing Lucide icons for input fields and UI consistency
import { LucideIcon, User, Lock, Zap } from "lucide-react";
import { useAppContext } from "@/components/AppContext";
import { UseAPI } from "@/components/hooks/UseAPI";
import { PrimaryButton } from "@/components/Button";
import { validatePassword } from "@/components/hooks/validatePassword";
import { InputField } from "@/components/functions/Helper";
import { AkiraStarsBackground } from "@/components/Stars";
import { useRouter } from "next/navigation";

const LoginContent: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // Assuming a full password validation object is not strictly necessary for just login, but we keep the handler.
  const [passwordErrors, setPasswordErrors] = useState(validatePassword(""));
  const [loading, setLoading] = useState<boolean>(false);

  const { addToast, setUser, setAlertMessage } = useAppContext();
  const router = useRouter();
  const { callApi } = UseAPI();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    // You might optionally run validation here for feedback, but usually not required for login
    setPasswordErrors(validatePassword(newPassword));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage("null", null); // Clear any previous alerts
    setLoading(true);

    try {
      if (!email || !password) {
        // Use the Banner Alert for critical form failure before API call
        setAlertMessage(
          "Email and password fields are required to sign in.",
          "error",
        );
        addToast("Email and password fields are required to sign in.", "error");
        return;
      }

      // Show Loading Banner
      setAlertMessage("Signing into your account...", "loading");
      addToast("Signing into your account...", "loading");

      const response = await callApi("/user/login", "POST", {
        email,
        password,
      });

      localStorage.setItem("token", response.token);
      setUser(response.data);

      // Success message (will auto-clear the banner after 4s)
      setAlertMessage(
        "Authentication successful. Redirecting to dashboard.",
        "success",
      );
      addToast(
        "Authentication successful. Redirecting to dashboard.",
        "success",
      );

      // Delay navigation slightly to allow success banner to show briefly
      router.push("/dashboard?view=ai-training");
      setTimeout(() => {}, 200);
    } catch (error: any) {
      console.error("An error occurred during sign-in:", error);

      // Use the Banner Alert for critical API/Auth failure
      setAlertMessage(
        error.message || "Login failed. Please check your credentials.",
        "error",
      );
      addToast(
        error.message || "Login failed. Please check your credentials.",
        "error",
      );
    } finally {
      setLoading(false);
      // setAlertMessage is intentionally NOT cleared here if it's an error/success type,
      // allowing the auto-clear logic (4s) in AppProvider to take effect.
    }
  };

  return (
    <form
      onSubmit={handleSignIn}
      className={`
        w-full max-w-lg p-6 sm:p-8 space-y-6 
        bg-gray-900/80 rounded-3xl 
        border border-gray-800 backdrop-blur-md 
        shadow-2xl shadow-purple-500/20 
        relative z-10 mx-auto transition-all duration-500
      `}
    >
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-6">
        Welcome Back to Akira
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

      {/* Optional password error display (simplified for login) */}
      {passwordErrors.minLength && password.length > 0 && (
        <div className="text-yellow-400 text-sm">
          • Password should meet security requirements.
        </div>
      )}

      {/* Links: Forgot password on the right, Sign up below */}
      <div className="flex justify-end pt-1">
        <a
          href="/register/forgot-password"
          className="text-sm text-[#00A7FF] hover:underline transition duration-200"
        >
          Forgot Password?
        </a>
      </div>

      <PrimaryButton
        type="submit"
        className={`mt-5 w-full font-bold tracking-wide`}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 animate-pulse" />
            <span>Signing In...</span>
          </span>
        ) : (
          "Sign In"
        )}
      </PrimaryButton>

      <p className="text-center text-gray-400 pt-2 text-sm">
        Don't have an account?{" "}
        <a
          href="/register"
          className={`text-[#A500FF] font-semibold hover:underline transition duration-200`}
        >
          Sign Up
        </a>
      </p>
    </form>
  );
};

// --- Main Page Component (Wrapper) ---

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen font-inter bg-[#050505] antialiased overflow-x-hidden relative flex items-center justify-center p-4">
      {/* 1. Nebula Background Effect */}
      <AkiraStarsBackground density={200} />

      {/* 2. Main Content Wrapper */}
      <div className="py-12 w-full max-w-xl">
        {/* Using LoginContent here */}
        <LoginContent />
      </div>
    </div>
  );
};

export default LoginPage;
