"use client";
import { NEON_GRADIENT } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "./AppContext";
import { UseAPI } from "./hooks/UseAPI";
import { useEffect, useMemo, useState } from "react";
import { validatePassword } from "./hooks/validatePassword";
import {
  Code,
  DollarSign,
  Link,
  Lock,
  Mail,
  Star,
  Store,
  User,
} from "lucide-react";
import Button from "./Button";
import {
  InputField,
  PasswordRequirement,
  PlatformButton,
} from "../components/functions/Helper";

// ⚡ IMPORT NEW COMPONENT ⚡
import StoreConnector from "./onboarding/StoreConnector";

const RegisterContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast, setUser, setAlertMessage, user, syncQuotas } = useAppContext();
  const { callApi } = UseAPI();

  const [nextStep, setNextStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState(validatePassword(""));
  const [terms, setTerms] = useState(false);

  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");

  // --- 1. NEURAL LINK (WebSocket) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token || !user) return;

      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'}?token=${token}&type=dashboard`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "STORE_CONNECTED") {
          syncQuotas();
        }
      };

      return () => ws.close();
    }
  }, [user, syncQuotas]);

  useEffect(() => {
    const urlStep = searchParams.get("step");
    if (urlStep === "connect-store" || (user && user.id)) {
      setNextStep(2);
    }
  }, [user, searchParams]);

  const selectedPlan = (searchParams.get("plan") || "free").toUpperCase();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordErrors(validatePassword(newPassword));
  };

  const isPasswordStrong = useMemo(() => {
    return Object.values(passwordErrors).every((value) => value === false);
  }, [passwordErrors]);

  const handleRegistration = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setAlertMessage("");
    setLoading(true);

    try {
      if (nextStep === 1) {
        // --- Step 1: Account Creation ---
        if (!name || !email || !password || !confirmPassword || !isPasswordStrong || !terms) {
          addToast("Please correct account details and accept terms.", "error");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          addToast("Passwords do not match.", "error");
          setLoading(false);
          return;
        }

        addToast("Creating your account...", "loading");
        const response = await callApi("/user/signup", "POST", {
          name,
          email,
          password,
          plan: selectedPlan,
        });

        if (response.token) {
          localStorage.setItem("token", response.token);
          setUser(response.data);
          setAlertMessage("Account created! Now connect your store.", "success");
          setNextStep(2);
        }

      } else if (nextStep === 2) {
        if (!url || !platform) {
          addToast("You must select a platform and provide a URL.", "error");
          return;
        }
      }
    } catch (error: any) {
      addToast(error.message || "An unexpected error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const Step1 = (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-3xl font-extrabold text-center mb-2 text-white">Create Cliva Account</h1>
      <p className="text-center text-gray-400 mb-6">
        Signing up for <span className="font-bold text-white uppercase">{selectedPlan}</span>
      </p>

      <div className="space-y-4">
        <InputField label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} icon={User} />
        <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} />
        <InputField label="Password" type="password" value={password} onChange={handlePasswordChange} icon={Lock} />
        <InputField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={Lock} />
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gray-800/70 border border-gray-700 shadow-inner">
        <h3 className="text-white text-md font-semibold mb-2">Security Checklist:</h3>
        <ul className="grid grid-cols-2 gap-2">
          <PasswordRequirement text="Min 8 chars" passed={passwordErrors.minLength} />
          <PasswordRequirement text="Max 50 chars" passed={passwordErrors.maxLength} />
          <PasswordRequirement text="1 Capital" passed={passwordErrors.capitalLetter} />
          <PasswordRequirement text="1 Lowercase" passed={passwordErrors.hasLowercase} />
          <PasswordRequirement text="1 Number" passed={passwordErrors.number} />
          <PasswordRequirement text="1 Special" passed={passwordErrors.specialChar} />
        </ul>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <div className="flex items-center">
          <input type="checkbox" id="terms" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="w-4 h-4 text-[#A500FF] bg-gray-700 border-gray-600 rounded" />
          <label htmlFor="terms" className="ml-2 text-gray-300 text-sm">Accept <a href="#" className="text-[#00A7FF] hover:underline">Terms & Service</a></label>
        </div>
      </div>

      <Button
        type="button"
        onClick={() => handleRegistration()}
        className="w-full font-semibold mt-4"
        disabled={loading || !isPasswordStrong || password !== confirmPassword || !terms}
      >
        {loading ? "Creating Account..." : "Next: Connect Store"}
      </Button>
      <p className="text-center text-gray-400 pt-2 text-sm">
        Already have an account?{" "}
        <a
          href="/register/sign-in"
          className="text-[#A500FF] font-semibold hover:underline transition duration-200"
        >
          Sign In
        </a>
      </p>
    </div>
  );

  const Step2 = (
    <div className="animate-in slide-in-from-right duration-500">
      <h1 className="text-3xl font-extrabold text-center mb-6">Connect Your Store</h1>
      <p className="text-center text-gray-400 mb-6">Select your platform to begin syncing product data with Cliva.</p>

      <div className="pt-4">
        <label className="text-sm font-medium text-gray-400 block mb-3">Select Platform</label>
        <div className="flex flex-wrap justify-center gap-4">
          <PlatformButton name="Shopify" icon={Store} onClick={() => setPlatform("shopify")} platform={platform} />
          <PlatformButton name="WooCommerce" icon={DollarSign} onClick={() => setPlatform("woocommerce")} platform={platform} />
          <PlatformButton name="Custom Site" icon={Code} onClick={() => setPlatform("custom")} platform={platform} />
          <PlatformButton name="Wix" icon={Star} onClick={() => setPlatform("wix")} platform={platform} />
        </div>
      </div>

      <div className="pt-8">
        <InputField
          label="Store URL"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          icon={Link}
          placeholder={platform === "shopify" ? "store.myshopify.com" : "https://domain.com"}
        />
      </div>

      <div className="flex justify-between items-center mt-6">
        <button type="button" onClick={() => setNextStep(1)} className="text-[#A500FF] hover:underline text-sm font-medium">← Back</button>
      </div>

      <StoreConnector
        platform={platform}
        url={url}
        loading={loading}
        setLoading={setLoading}
        onValidatedSubmit={handleRegistration}
      />
    </div>
  );

  return (
    <div className="w-full max-w-lg p-6 sm:p-8 space-y-6 bg-gray-900/80 rounded-3xl border border-gray-800 backdrop-blur-md shadow-2xl relative z-10 mx-auto transition-all animate-in fade-in zoom-in duration-500">
      {/* Step Indicator */}
      <div className="flex justify-center items-center mb-8 pt-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${nextStep === 1 ? 'bg-gradient-to-r from-[#A500FF] to-[#FFB300]' : "bg-gray-700"}`}>
          {nextStep === 1 ? <Star className="w-4 h-4 text-white" /> : "1"}
        </div>
        <div className={`h-0.5 w-16 mx-2 transition-all duration-300 ${nextStep > 1 ? 'bg-gradient-to-r from-[#A500FF] to-[#FFB300]' : "bg-gray-700"}`} />
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${nextStep === 2 ? 'bg-gradient-to-r from-[#A500FF] to-[#FFB300]' : "bg-gray-700"}`}>
          {nextStep === 2 ? <Star className="w-4 h-4 text-white" /> : "2"}
        </div>
      </div>

      {nextStep === 1 ? Step1 : Step2}
    </div>
  );
};

export default RegisterContent;