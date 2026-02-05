"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/components/AppContext";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useEffect, useMemo, useState } from "react";
import { validatePassword } from "@/components/hooks/validatePassword";
import { User, Mail, Lock, Link, ShieldCheck, Loader2 } from "lucide-react";
import Button from "@/components/Button";
import { InputField } from "@/components/functions/Helper";
import StoreConnector from "@/components/onboarding/StoreConnector";

const RegisterContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast, setUser, user } = useAppContext();
  const { callApi } = UseAPI();

  const [isLogin, setIsLogin] = useState(false);
  const [nextStep, setNextStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Input States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [url, setUrl] = useState("");

  // Access Code State
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [assignedPlan, setAssignedPlan] = useState("FREE");

  // Initialize Early Access details
  useEffect(() => {
    const code = searchParams.get("code") || sessionStorage.getItem("cliva_access_code");
    const plan = searchParams.get("plan") || "FREE";
    if (code) {
      setAccessCode(code);
      setAssignedPlan(plan.toUpperCase());
    } else {
      router.push("/early-access");
    }
  }, [searchParams, router]);

  /**
   * ⚡️ AUTO-NAVIGATE
   * If a user is already in the context, we check their store status.
   */
  useEffect(() => {
    if (user?.id) {
      if (user.store?.is_authorized || user.onboarding_step === "COMPLETED") {
        router.push("/dashboard");
      } else {
        setNextStep(2);
      }
    } else {
      setNextStep(1);
    }
  }, [user, router]);

  const passwordErrors = validatePassword(password);
  const isPasswordStrong = useMemo(() => Object.values(passwordErrors).every((v) => v === false), [passwordErrors]);

  const handleAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/user/login" : "/user/signup";
      const payload = isLogin
        ? { email, password }
        : { name, email, password, plan: assignedPlan, accessCode };

      if (!isLogin && password !== confirmPassword) throw new Error("Passwords mismatch");

      addToast(isLogin ? "Authenticating..." : "Building Founder Account...", "loading");

      const response = await callApi(endpoint, "POST", payload);

      if (response.token && response.data) {
        const userData = response.data;

        // 1. Persist Session
        localStorage.setItem("token", response.token);

        // 2. Set Global State (This triggers the useEffect auto-navigation above)
        setUser(userData);

        addToast(isLogin ? "Neural Link Verified." : "Account Secured.", "success");

        // 3. Conditional Routing Logic
        const hasStore = userData.store?.is_authorized || userData.onboarding_step === "COMPLETED";

        if (hasStore) {
          router.push("/dashboard");
        } else {
          setNextStep(2);
        }
      }
    } catch (error: any) {
      addToast(error.message || "Connection to Cliva failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const Step1 = (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter text-balance">
          {isLogin ? "Welcome Back" : "Founding Member"}
        </h1>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A500FF]/10 border border-[#A500FF]/20">
          <ShieldCheck size={12} className="text-[#A500FF]" />
          <span className="text-[10px] font-black text-[#A500FF] uppercase tracking-widest leading-none">
            {isLogin ? "Neural Identity Protected" : `Access Code: ${accessCode}`}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {!isLogin && <InputField label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} icon={User} placeholder="John Doe" />}
        <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} placeholder="founder@store.com" />
        <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={Lock} placeholder="••••••••" />
        {!isLogin && <InputField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={Lock} placeholder="••••••••" />}
      </div>

      <Button
        onClick={() => handleAuth()}
        className="w-full font-bold h-14 bg-white text-black hover:bg-neutral-200 transition-colors"
        disabled={loading || (!isLogin && !isPasswordStrong)}
      >
        {loading ? <Loader2 className="animate-spin" /> : isLogin ? "Sign In" : "Initialize Account"}
      </Button>

      <p className="text-center text-xs text-neutral-500 font-medium">
        {isLogin ? "New Founder?" : "Already verified?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#A500FF] hover:text-[#A500FF]/80 font-bold transition-colors"
        >
          {isLogin ? "Join Program" : "Log In"}
        </button>
      </p>
    </div>
  );

  const Step2 = (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Connect Shopify</h2>
        <p className="text-neutral-500 text-sm mt-1">Founding members get priority sync speeds.</p>
      </div>

      <InputField
        label="Shopify URL"
        type="text"
        placeholder="your-store.myshopify.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        icon={Link}
      />

      <StoreConnector
        platform="shopify"
        url={url}
        loading={loading}
        setLoading={setLoading}
        onValidatedSubmit={async (e) => { }}
      />

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setUser(null);
          }}
          className="text-[10px] text-neutral-600 uppercase font-black tracking-widest hover:text-white transition-colors"
        >
          ← Use different account
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-lg p-6 sm:p-8 space-y-6 bg-gray-900/80 rounded-3xl border border-gray-800 backdrop-blur-md shadow-2xl relative z-10 mx-auto transition-all animate-in fade-in zoom-in duration-500">
      {nextStep === 1 ? Step1 : Step2}
    </div>
  );
};

export default RegisterContent;