"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { CheckCircle, ShieldCheck, Zap, Star, LayoutDashboard } from "lucide-react";
import { useAppContext } from "../AppContext";
import { UseAPI } from "@/components/hooks/UseAPI";
import { PLAN_CONFIG } from "@/utils/checkPlan";
import { ClivaStarsBackground } from "@/components/Stars";

// Dynamically import to avoid SSR window error
const PaystackButton = dynamic(() => import('../hooks/PayStackButton'), { ssr: false });

const PaymentWall: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast, setUser, user, syncQuotas } = useAppContext();
  const { callApi } = UseAPI();

  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // URL Params
  const planQuery = (searchParams.get("plan") || "BASIC").toUpperCase();
  const plan = PLAN_CONFIG[planQuery as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.BASIC;
  const isPaidPlanSelected = plan.price > 0;

  const US_TO_NGN_RATE = 1600;

  const finalizeUpgrade = async (reference: string) => {
    setLoading(true);
    addToast("Securing your connection...", "loading");

    try {
      const response = await callApi("/upgrade-plan", "PATCH", {
        plan: planQuery,
        storeId: user?.store?.id,
        paystackReference: reference,
      });

      setPaymentSuccess(true);

      // Refresh session to update AuthGuard
      const freshUser = await callApi("/verify-session", "GET");
      setUser(freshUser.user);
      await syncQuotas();

      addToast("Subscription Activated!", "success");

      setTimeout(() => {
        router.replace('/dashboard?view=ai-training');
      }, 2000);

    } catch (error: any) {
      addToast(error.message || "Verification failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 bg-gray-900/50 backdrop-blur-xl rounded-[40px] border border-green-500/30 shadow-2xl">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-4xl font-black text-white mb-4 italic uppercase">Neural Link Established</h2>
        <p className="text-gray-400 mb-8">Accessing your Cliva {planQuery} command center...</p>
        <LayoutDashboard className="w-8 h-8 text-[#A500FF] animate-bounce" />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <ClivaStarsBackground density={150} />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-gray-900/40 backdrop-blur-2xl rounded-[40px] border border-gray-800 shadow-2xl">

        {/* Left Side: Info */}
        <div className="p-10 lg:p-12 bg-gradient-to-br from-[#A500FF]/10 to-transparent border-r border-gray-800">
          <div className="px-3 py-1 rounded-full bg-[#A500FF]/20 border border-[#A500FF]/30 text-[#A500FF] text-xs font-bold uppercase tracking-widest mb-6 w-fit">
            Selected Plan
          </div>

          <h2 className="text-5xl font-black text-white mb-2 uppercase">{planQuery}</h2>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-4xl font-light text-white">${plan.price}</span>
            <span className="text-gray-500">/ month</span>
          </div>

          <ul className="space-y-4">
            {plan.features.map((feature: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-gray-300">
                <Star className="w-5 h-5 text-[#00A7FF] fill-[#00A7FF]/20 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Action */}
        <div className="p-10 lg:p-12 flex flex-col justify-center bg-black/20">
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="text-green-500 w-6 h-6" /> Secure Activation
            </h3>
            <p className="text-gray-400 text-sm">Activate your neural store link. Encrypted via Paystack.</p>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gray-800/40 border border-gray-700/50">
              <div className="flex justify-between items-center mb-1 text-gray-400 text-xs uppercase tracking-widest">
                <span>Total to pay</span>
                <Zap className="w-4 h-4 text-[#FFB300]" />
              </div>
              <div className="text-3xl font-mono font-bold text-white">
                ₦{(plan.price * US_TO_NGN_RATE).toLocaleString()}
              </div>
            </div>

            <PaystackButton
              planName={planQuery}
              isPaidPlanSelected={isPaidPlanSelected}
              loading={loading}
              email={user?.email || ""}
              amount={plan.price * US_TO_NGN_RATE * 100}
              onSuccess={(ref: any) => finalizeUpgrade(ref.reference)}
              onClose={() => addToast("Security check cancelled.", "info")}
            />

            <div className="flex items-center justify-center gap-4 pt-4 grayscale opacity-50">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest italic">Cliva Security Node Alpha</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentWall;