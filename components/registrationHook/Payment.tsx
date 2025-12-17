"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, CheckCircle, Lock, Loader2 } from "lucide-react";
import { useAppContext } from "../AppContext";
import { UseAPI } from "@/components/hooks/UseAPI";
import { PLAN_CONFIG } from "@/utils/checkPlan";

const PaymentWall: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast, setAlertMessage, user } = useAppContext();
  const { callApi } = UseAPI();

  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // ⚡ GUARD: Prevents the "Maximum update depth exceeded" error
  const hasToasted = useRef(false);

  // Determine plan from URL (e.g., ?plan=pro -> PREMIUM)
  const planQuery = (searchParams.get("plan") || "basic").toLowerCase();
  const selectedPlanKey = planQuery === "pro" ? "PREMIUM" : planQuery.toUpperCase();
  const storeUrl = searchParams.get("store");

  // Get plan details from your central config
  const plan = PLAN_CONFIG[selectedPlanKey as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.BASIC;

  useEffect(() => {
    // If we've already shown the success toast for this session, stop.
    if (hasToasted.current) return;

    if (!user || !user.id) {
      addToast("Please log in to continue.", "error");
    }

    if (storeUrl) {
      addToast(`Store ${storeUrl} successfully connected!`, "success");
      // Mark as done so re-renders don't trigger another toast
      hasToasted.current = true;
    }
  }, [user, storeUrl, addToast]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage("Processing payment...", "loading");

    // Skip payment for free tier
    if (plan.price <= 0) {
      addToast("Free plan selected. Skipping payment.", "info");
      handleFinalizeSubscription();
      return;
    }

    try {
      // ⚠️ Note: This is a placeholder for your future Paystack integration
      const paymentResponse = await callApi("/process-payment", "POST", {
        plan: selectedPlanKey,
        storeUrl: storeUrl,
        cardDetails: cardDetails,
      });

      if (paymentResponse.success) {
        setPaymentSuccess(true);
        handleFinalizeSubscription();
      } else {
        throw new Error(paymentResponse.message || "Payment declined.");
      }
    } catch (error: any) {
      setAlertMessage(error.message || "Payment failed.", "error");
      addToast(error.message || "Payment failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeSubscription = () => {
    setAlertMessage("Subscription active! Redirecting to dashboard...", "success");
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="w-full max-w-lg mx-auto p-10 bg-gray-900 rounded-3xl text-center border border-green-600/50 shadow-xl relative z-10">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Payment Confirmed!</h2>
        <p className="text-gray-400">Your {selectedPlanKey} plan is now active.</p>
        <button onClick={handleFinalizeSubscription} className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-gray-900/80 rounded-3xl border border-gray-800 backdrop-blur-md shadow-2xl relative z-10">
      <h1 className="text-3xl font-extrabold text-center text-white mb-3 flex items-center justify-center gap-2">
        <CreditCard className="w-7 h-7 text-[#FFB300]" /> Final Step: Activate
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Plan Overview */}
        <div className="space-y-4 p-4 rounded-xl bg-gray-800 border border-gray-700 h-fit">
          <h2 className="text-2xl font-bold text-[#A500FF] uppercase">{planQuery} Plan</h2>
          <p className="text-4xl font-extrabold text-white">${plan.price} <span className="text-lg text-gray-500">/mo</span></p>
          <ul className="space-y-2 text-sm text-gray-300 pt-3 border-t border-gray-700">
            {plan.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="p-3 bg-blue-900/20 text-sm text-blue-300 rounded-lg flex items-center gap-2">
            <Lock className="w-4 h-4" /> Secure SSL Encryption
          </div>
          <input type="text" placeholder="Card Number" required onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white outline-none focus:border-[#A500FF]" />
          <div className="flex gap-4">
            <input type="text" placeholder="MM/YY" required onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              className="w-1/2 p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white outline-none focus:border-[#A500FF]" />
            <input type="text" placeholder="CVC" required onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
              className="w-1/2 p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white outline-none focus:border-[#A500FF]" />
          </div>
          <input type="text" placeholder="Name on Card" required onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white outline-none focus:border-[#A500FF]" />
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-bold transition ${loading ? 'bg-gray-600' : 'bg-gradient-to-r from-[#FFB300] to-[#A500FF] hover:opacity-90'} text-white`}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Pay $${plan.price}.00 & Launch`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentWall;