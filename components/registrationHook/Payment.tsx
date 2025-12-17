"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Zap, CheckCircle, Store, Lock, Loader2 } from "lucide-react";
import { useAppContext } from "../AppContext";
import { UseAPI } from "@/components/hooks/UseAPI";
// Assume you have a CreditCardInput component for handling secure fields

interface PlanDetails {
  price: number;
  description: string;
  features: string[];
}

const PLAN_DETAILS: Record<string, PlanDetails> = {
  free: { price: 0, description: "Forever free tier, great for small shops.", features: ["Basic Analytics", "50 AI Queries/Month"] },
  basic: { price: 49, description: "Essential tools for growing your sales.", features: ["2,000 AI Queries/Month", "Product Analysis", "Real-Time Tracking"] },
  premium: { price: 99, description: "Full-scale intelligence for high-volume stores.", features: ["Unlimited AI Queries", "Full RL Feedback Loop", "Priority Support"] },
};

const PaymentWall: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast, setAlertMessage, user } = useAppContext();
  const { callApi } = UseAPI();

  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [paymentSuccess, setPaymentSuccess] = useState(false); // To handle payment success screen

  // Get the selected plan from the URL query params
  const selectedPlanKey = (searchParams.get("plan") || "basic").toLowerCase();
  const storeUrl = searchParams.get("store"); // The store URL passed back from the Shopify callback

  const plan = PLAN_DETAILS[selectedPlanKey] || PLAN_DETAILS.basic;

  // Safety check to ensure the user is logged in and has a connected store
  useEffect(() => {
    if (!user || !user.id) {
      addToast("Please log in to continue.", "error");
      // router.push('/register/sign-in'); // Redirect if not logged in
    }
    if (storeUrl) {
      // Optional: Confirm store status based on URL param
      addToast(`Store ${storeUrl} successfully connected!`, "success");
    }
  }, [user, storeUrl]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage("Processing payment...", "loading");

    if (plan.price <= 0) {
      addToast("Free plan selected. Skipping payment.", "info");
      handleFinalizeSubscription();
      return;
    }

    try {
      // ⚠️ Step 1: Call your backend to process payment via Stripe/PayPal/etc.
      const paymentResponse = await callApi("/billing/process-payment", "POST", {
        plan: selectedPlanKey,
        storeUrl: storeUrl,
        cardDetails: cardDetails, // In a real app, this would use a tokenized ID!
      });

      if (paymentResponse.success) {
        // ⚠️ Step 2: Update the user/store status in your DB (done in backend, but confirmed here)
        setPaymentSuccess(true);
        handleFinalizeSubscription();
      } else {
        throw new Error(paymentResponse.message || "Payment processor declined the transaction.");
      }

    } catch (error: any) {
      setAlertMessage(error.message || "Payment failed. Please check your card details.", "error");
      addToast(error.message || "Payment failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeSubscription = () => {
    // Final action after payment (or skipping payment for the free tier)
    setAlertMessage("Subscription active! Redirecting to dashboard...", "success");
    setTimeout(() => {
      router.push('/dashboard'); // Land the user on the dashboard
    }, 1500);
  };

  if (paymentSuccess) {
    return (
      <div className="w-full max-w-lg mx-auto p-10 bg-gray-900 rounded-3xl text-center border border-green-600/50 shadow-xl">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-white mb-2">Payment Confirmed!</h2>
        <p className="text-gray-400">Your Akira subscription for the **{selectedPlanKey.toUpperCase()}** plan is now active.</p>
        <button
          onClick={handleFinalizeSubscription}
          className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }


  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-gray-900/80 rounded-3xl border border-gray-800 backdrop-blur-md shadow-2xl">
      <h1 className="text-3xl font-extrabold text-center text-white mb-3 flex items-center justify-center gap-2">
        <CreditCard className="w-7 h-7 text-[#FFB300]" /> Final Step: Activate Subscription
      </h1>
      <p className="text-center text-gray-400 mb-8">
        Your store is connected! Complete the secure payment below to unlock Akira AI features.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1. Plan Summary */}
        <div className="space-y-4 p-4 rounded-xl bg-gray-800 border border-gray-700 h-fit">
          <h2 className="text-2xl font-bold text-[#A500FF] uppercase">{selectedPlanKey} Plan</h2>
          <p className="text-4xl font-extrabold text-white">${plan.price} <span className="text-lg text-gray-500">/mo</span></p>
          <p className="text-sm text-gray-400">{plan.description}</p>
          <ul className="space-y-2 text-sm text-gray-300 pt-3 border-t border-gray-700">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> {feature}
              </li>
            ))}
          </ul>
          {storeUrl && (
            <p className="pt-3 text-xs text-gray-500 flex items-center gap-1">
              <Store className="w-3 h-3" /> Connected Store: {storeUrl}
            </p>
          )}
        </div>

        {/* 2. Payment Form */}
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Payment Details</h3>

          {/* Security Note */}
          <div className="p-3 bg-red-900/30 text-sm text-red-300 rounded-lg flex items-center gap-2">
            <Lock className="w-4 h-4" /> This is a placeholder. In production, use Stripe/PayPal tokenization for PCI compliance.
          </div>

          {/* Card Number Input (Mock) */}
          <input type="text" placeholder="Card Number (Mock: 16 digits)" required
            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white outline-none" />

          {/* Expiry and CVC (Mock) */}
          <div className="flex gap-4">
            <input type="text" placeholder="MM/YY" required
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              className="w-1/2 p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white outline-none" />
            <input type="text" placeholder="CVC" required
              onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
              className="w-1/2 p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white outline-none" />
          </div>

          {/* Name on Card (Mock) */}
          <input type="text" placeholder="Name on Card" required
            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
            className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white outline-none" />

          <button type="submit" disabled={loading || plan.price === 0}
            className={`w-full py-3 rounded-lg font-bold transition duration-200 
                            ${loading ? 'bg-gray-600' : 'bg-gradient-to-r from-[#FFB300] to-[#A500FF] hover:from-[#A500FF] hover:to-[#00A7FF]'} text-white`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</span>
            ) : (
              `Pay $${plan.price}.00 and Launch Akira`
            )}
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">By clicking 'Pay', you agree to start your monthly subscription.</p>
        </form>
      </div>
    </div>
  );
};

export default PaymentWall;