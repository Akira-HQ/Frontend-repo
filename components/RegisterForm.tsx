// --- RegisterContent.tsx (MODIFIED) ---

import { NEON_GRADIENT } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "./AppContext";
import { UseAPI } from "./hooks/UseAPI";
import { useMemo, useState } from "react";
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
  const { addToast, setUser, setAlertMessage } = useAppContext();
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

  const selectedPlan = searchParams.get("plan") || "free";

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordErrors(validatePassword(newPassword));
  };

  const isPasswordStrong = useMemo(() => {
    return Object.values(passwordErrors).every((value) => value === false);
  }, [passwordErrors]);

  // ⚠️ MODIFIED: handleRegistration only validates, the final API call is deferred to StoreConnector
  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    setAlertMessage("");
    setLoading(true);

    try {
      if (nextStep === 1) {
        // --- Step 1: Validation and Account Creation ---
        if (!name || !email || !password || !confirmPassword || !isPasswordStrong || !terms) {
          setAlertMessage("Please correct account details and accept terms.", "error");
          return;
        }
        if (password !== confirmPassword) {
          addToast("Passwords do not match.", "error");
          return;
        }

        // API Call: Create User
        setAlertMessage("Creating your account...", "loading");
        const response = await callApi("/user/signup", "POST", {
          name,
          email,
          password,
          plan: selectedPlan,
        });

        localStorage.setItem("token", response.token);
        setUser(response.data);

        setAlertMessage("Account created successfully. Now connect your store.", "success");
        setNextStep(2); // Move to Step 2

      } else if (nextStep === 2) {
        // ⚠️ Step 2: Validation is now just checking inputs, the actual connection logic is in the child component.
        if (!url || !platform) {
          setAlertMessage("You must select a platform and provide a URL.", "error");
          addToast("You must select a platform and provide a URL.", "error");
          return;
        }
        // Logic handled by StoreConnector component via the onSubmit prop.
      }
    } catch (error: any) {
      setAlertMessage(
        error.message || "An unexpected error occurred during setup.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const Step1 = (
    // ... (JSX for Step 1 remains unchanged)
    <>
      <h1 className="text-3xl font-extrabold text-center mb-6 text-white">
        Create Akira Account
      </h1>
      <p className="text-center text-gray-400 mb-6">
        You're signing up for the{" "}
        <span className="font-bold text-white uppercase">{selectedPlan}</span>{" "}
        plan.
      </p>

      <div className="space-y-4">
        <InputField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={User}
        />
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          icon={Lock}
        />
        <InputField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={Lock}
        />
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gray-800/70 border border-gray-700 shadow-inner">
        <h3 className="text-white text-md font-semibold mb-2">
          Password Requirements:
        </h3>
        <ul className="grid grid-cols-2 gap-2">
          <PasswordRequirement
            text="Min 8 characters"
            passed={passwordErrors.minLength}
          />
          <PasswordRequirement
            text="Max 50 characters"
            passed={passwordErrors.maxLength}
          />
          <PasswordRequirement
            text="1 Capital Letter"
            passed={passwordErrors.capitalLetter}
          />
          <PasswordRequirement
            text="1 Lowercase Letter"
            passed={passwordErrors.hasLowercase}
          />
          <PasswordRequirement text="1 Number" passed={passwordErrors.number} />
          <PasswordRequirement
            text="1 Special Character"
            passed={passwordErrors.specialChar}
          />
        </ul>
      </div>

      <div className="flex flex-col justify-between items-start gap-3 mt-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="w-4 h-4 text-[#A500FF] bg-gray-700 border-gray-600 rounded focus:ring-[#A500FF]"
          />
          <label htmlFor="terms" className="ml-2 text-gray-300 text-sm">
            I accept the{" "}
            <a href="/terms-of-service" className="text-[#00A7FF] hover:underline">
              Terms & Service
            </a>
          </label>
        </div>
        <a
          href="/register/sign-in"
          className="text-sm text-gray-400 hover:text-white transition duration-200 underline"
        >
          Already have an account?
        </a>
      </div>

      <Button
        type="submit"
        className="w-full font-semibold mt-4"
        disabled={
          loading || !isPasswordStrong || password !== confirmPassword || !terms
        }
      >
        {loading ? "Creating Account..." : "Next: Connect Store"}
      </Button>
    </>
  );

  const Step2 = (
    <>
      <h1 className="text-3xl font-extrabold text-center mb-6">
        Connect Your Store
      </h1>
      <p className="text-center text-gray-400 mb-6">
        Select your e-commerce platform and provide the primary URL to begin
        syncing product data with Akira.
      </p>

      <div className="pt-4">
        <label className="text-sm font-medium text-gray-400 block mb-3">
          Select Platform
        </label>
        <div className="flex flex-wrap justify-center gap-4">
          <PlatformButton
            name="Shopify"
            icon={Store}
            onClick={() => setPlatform("shopify")}
            platform={platform}
          />
          <PlatformButton
            name="WooCommerce"
            icon={DollarSign}
            onClick={() => setPlatform("woocommerce")}
            platform={platform}
          />
          <PlatformButton
            name="Custom Site"
            icon={Code}
            onClick={() => setPlatform("custom")}
            platform={platform}
          />
          <PlatformButton
            name="Wix"
            icon={Star}
            onClick={() => setPlatform("wix")}
            platform={platform}
          />
        </div>
      </div>

      <div className="pt-8">
        <InputField
          label="Store URL"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          icon={Link}
          placeholder={
            platform === "shopify"
              ? "your-store.myshopify.com"
              : "https://your-domain.com"
          }
        />
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={() => setNextStep(1)}
          className="text-[#A500FF] hover:underline text-sm font-medium"
        >
          ← Back to Account Details
        </button>
      </div>

      {/* ⚡ Replaced Button with Connector Component ⚡ */}
      <StoreConnector
        platform={platform}
        url={url}
        loading={loading}
        setLoading={setLoading}
        onValidatedSubmit={handleRegistration}
      />
    </>
  );

  // --- Form Structure ---
  return (
    <form
      onSubmit={handleRegistration}
      className="
      w-full max-w-lg p-6 sm:p-8 space-y-6 
      bg-gray-900/80 rounded-3xl 
      border border-gray-800 backdrop-blur-md 
      shadow-2xl shadow-purple-500/20 
      relative z-10 mx-auto transition-all duration-500
      "
    >
      {/* Step Indicator */}
      <div className="flex justify-center items-center mb-8 pt-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${nextStep === 1 ? NEON_GRADIENT : "bg-gray-700"}`}
        >
          {nextStep === 1 ? <Star className="w-4 h-4 text-white" /> : "1"}
        </div>
        <div
          className={`h-0.5 w-16 mx-2 transition-all duration-300 ${nextStep > 1 ? NEON_GRADIENT : "bg-gray-700"}`}
        ></div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${nextStep === 2 ? NEON_GRADIENT : "bg-gray-700"}`}
        >
          {nextStep === 2 ? <Star className="w-4 h-4 text-white" /> : "2"}
        </div>
      </div>

      {nextStep === 1 ? Step1 : Step2}
    </form>
  );
};

export default RegisterContent;