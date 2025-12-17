"use client";
import React, { useState } from 'react';
import { CreditCard, Zap, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/components/AppContext';
import { UseAPI } from '@/components/hooks/UseAPI';

// 🛑 FIX: Changed import name from PLAN_DETAILS to PLAN_CONFIG 
// and adjusted the assumed path to the shared config file.
import { PLAN_CONFIG } from '@/utils/checkPlan';
import { AkiraStarsBackground } from '@/components/Stars';

interface PlanCardProps {
  planKey: string;
  details: any;
  onSelect: (key: string) => void;
  currentPlan: string;
  isActive: boolean;
}

// --- Plan Card Component ---
const PlanCard: React.FC<PlanCardProps> = ({ planKey, details, onSelect, currentPlan, isActive }) => {
  const isCurrent = currentPlan.toUpperCase() === planKey.toUpperCase();
  const isPaid = details.price > 0;

  return (
    <div className={`p-6 rounded-xl border-2 transition-all duration-300 shadow-lg cursor-pointer h-full
            ${isCurrent ? 'bg-[#A500FF]/20 border-[#A500FF] shadow-[#A500FF]/50' : 'bg-gray-900 border-gray-700 hover:border-[#00A7FF]'}`}
      onClick={() => onSelect(planKey)}
    >
      <h3 className="text-2xl font-bold uppercase mb-2" style={{ color: isCurrent ? '#A500FF' : 'white' }}>
        {planKey}
      </h3>
      <p className="text-4xl font-extrabold text-white mb-4">
        {details.price === 0 ? 'FREE' : `$${details.price}`}
        {isPaid && <span className="text-lg text-gray-500">/mo</span>}
      </p>

      {isCurrent && <div className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Your Current Plan</div>}

      <ul className="space-y-2 text-sm text-gray-300 pt-4 border-t border-gray-700">
        {details.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};


// --- Main Upgrade Page Component ---
const UpgradePlanPage: React.FC = () => {
  const router = useRouter();
  const { addToast, user } = useAppContext();
  const { callApi } = UseAPI();

  const [selectedPlanKey, setSelectedPlanKey] = useState<string>('BASIC');
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', tokenizedId: 'mock_payment_token_123' }); // Mock token ID

  // Use current user data for context
  const currentPlan = user?.plan?.toUpperCase() || 'FREE';
  const storeId = user?.store?.storeId;
  // 🛑 FIX: Use PLAN_CONFIG here
  const isPaidPlanSelected = PLAN_CONFIG[selectedPlanKey as keyof typeof PLAN_CONFIG]?.price > 0;

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeId) {
      addToast("Error: Store context missing. Please re-login.", "error");
      return;
    }

    if (selectedPlanKey.toUpperCase() === currentPlan) {
      addToast("You are already on the selected plan.", "info");
      return;
    }

    setLoading(true);
    addToast(`Attempting to update to ${selectedPlanKey}...`, "loading");

    // 1. Prepare Payload
    const payload = {
      plan: selectedPlanKey,
      storeId: storeId,
      // For paid plans, include the mock token
      tokenizedPaymentMethodId: isPaidPlanSelected ? cardDetails.tokenizedId : undefined,
      // In a real app, tokenization (Stripe.js) happens here.
    };

    try {
      // 2. API Call to the Secured Endpoint
      const response = await callApi("/upgrade-plan", "PATCH", payload);

      // 3. Success Feedback and Redirection
      addToast(response.message || `Successfully moved to ${selectedPlanKey} plan.`, "success");

      // ⚠️ NOTE: You should update the user context after a successful upgrade
      // by refetching the user/store data or using the data returned by the API.

      router.push('/dashboard/settings?tab=billing');

    } catch (error: any) {
      addToast(error.message || "Upgrade failed. Please check payment info.", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="py-20 px-4 bg-[#050505] relative">
      <AkiraStarsBackground density={200} />
      <div className="relative">
        <h1 className="text-4xl font-extrabold text-white text-center mb-2 flex items-center justify-center gap-3 relative">
          <Zap className="w-8 h-8 text-[#A500FF]" /> Upgrade Your Plan
        </h1>
        <p className="text-gray-400 text-center mb-10">
          Current Plan: <span className="font-semibold uppercase text-white">{currentPlan}</span> | Select a new tier below.
        </p>

        <form onSubmit={handleUpgrade} className="max-w-6xl mx-auto">
          {/* Plan Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {/* 🛑 FIX: Use PLAN_CONFIG for iteration 🛑 */}
            {Object.entries(PLAN_CONFIG).map(([key, details]) => (
              <PlanCard
                key={key}
                planKey={key}
                details={details}
                onSelect={setSelectedPlanKey}
                currentPlan={currentPlan}
                isActive={currentPlan.toUpperCase() === key.toUpperCase()}
              />
            ))}
          </div>

          {/* Payment/Action Section */}
          <div className="max-w-3xl mx-auto p-8 rounded-xl bg-gray-800 border border-gray-700 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
              {isPaidPlanSelected ? <CreditCard className="w-5 h-5 text-[#FFB300]" /> : <CheckCircle className="w-5 h-5 text-green-400" />}
              {isPaidPlanSelected ? 'Secure Payment' : 'Confirmation'}
            </h2>

            {isPaidPlanSelected && (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  Finalize your upgrade to the **{selectedPlanKey}** plan for ${PLAN_CONFIG[selectedPlanKey as keyof typeof PLAN_CONFIG].price}/month.
                </p>
                {/* ⚠️ Placeholder for real tokenization element ⚠️ */}
                <input
                  type="text"
                  placeholder="Mock Card Number / Token ID"
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white outline-none mb-4"
                />
              </>
            )}

            {!isPaidPlanSelected && (
              <p className="text-lg text-green-300 font-medium">
                No payment required. Your plan will be downgraded to **FREE** (or switched to the target free tier).
              </p>
            )}

            <button
              type="submit"
              disabled={loading || currentPlan.toUpperCase() === selectedPlanKey.toUpperCase()}
              className={`w-full mt-6 py-3 rounded-lg font-bold text-lg transition duration-200 
                            ${loading ? 'bg-gray-600' : 'bg-gradient-to-r from-[#A500FF] to-[#00A7FF] hover:opacity-80'} text-white`}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Processing...</span>
                : isPaidPlanSelected
                  ? `Confirm Upgrade & Pay $${PLAN_CONFIG[selectedPlanKey as keyof typeof PLAN_CONFIG].price}.00`
                  : 'Confirm Downgrade to FREE'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpgradePlanPage;