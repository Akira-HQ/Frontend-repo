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
  const { addToast, setAlertMessage, user, syncQuotas } = useAppContext();
  const { callApi } = UseAPI();

  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const hasToasted = useRef(false);
  const hasRedirected = useRef(false); // ⚡ Prevent infinite redirect loops

  // Determine plan from URL
  const planQuery = (searchParams.get("plan") || "basic").toLowerCase();
  const selectedPlanKey = planQuery === "pro" ? "PREMIUM" : planQuery.toUpperCase();
  const storeUrl = searchParams.get("store");

  const plan = PLAN_CONFIG[selectedPlanKey as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.BASIC;

  // --- ⚡ NEW: AUTOMATIC REDIRECT FOR FREE PLAN ⚡ ---
  useEffect(() => {
    if (selectedPlanKey === "FREE" && !hasRedirected.current) {
      hasRedirected.current = true;
      setLoading(true);

      const finalizeFreeTier = async () => {
        addToast("Free plan selected. Redirecting to dashboard...", "info");
        // Optional: Call your backend to finalize the 'FREE' status if necessary
        // await callApi("/finalize-free-setup", "POST", { storeUrl });

        await syncQuotas();
        handleFinalizeSubscription();
      };

      finalizeFreeTier();
    }
  }, [selectedPlanKey, syncQuotas]);

  useEffect(() => {
    if (hasToasted.current) return;
    if (!user || !user.id) {
      addToast("Please log in to continue.", "error");
    }
    if (storeUrl) {
      addToast(`Store ${storeUrl} successfully connected!`, "success");
      hasToasted.current = true;
    }
  }, [user, storeUrl, addToast]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage("Processing payment...", "loading");

    if (plan.price <= 0) {
      handleFinalizeSubscription();
      return;
    }

    try {
      const paymentResponse = await callApi("/process-payment", "POST", {
        plan: selectedPlanKey,
        storeUrl: storeUrl,
        cardDetails: cardDetails,
      });

      if (paymentResponse.success) {
        setPaymentSuccess(true);
        syncQuotas();
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
    setAlertMessage("Success! Accessing dashboard...", "success");
    // Short timeout to allow state sync and user to see the message
    setTimeout(() => {
      router.replace('/dashboard'); // Use replace to prevent back-button loops
    }, 1500);
  };

  // If redirecting the free user, show a full-screen loader
  if (selectedPlanKey === "FREE" && loading) {
    return (
      <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center z-[200]">
        <Loader2 className="w-12 h-12 text-[#A500FF] animate-spin mb-4" />
        <h2 className="text-white font-bold text-xl">Activating your store...</h2>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="w-full max-w-lg mx-auto p-10 bg-gray-900 rounded-3xl text-center border border-green-600/50 shadow-xl relative z-10">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Setup Confirmed!</h2>
        <p className="text-gray-400">Your {selectedPlanKey} dashboard is ready.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-gray-900/80 rounded-3xl border border-gray-800 backdrop-blur-md shadow-2xl relative z-10">
      <h1 className="text-3xl font-extrabold text-center text-white mb-3 flex items-center justify-center gap-2">
        <CreditCard className="w-7 h-7 text-[#FFB300]" /> Final Step: Activate
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
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
          <button type="submit" disabled={loading} className={`w-full py-3 rounded-lg font-bold transition ${loading ? 'bg-gray-600' : 'bg-gradient-to-r from-[#FFB300] to-[#A500FF] hover:opacity-90'} text-white shadow-lg active:scale-95`}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Pay $${plan.price}.00 & Launch`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentWall;