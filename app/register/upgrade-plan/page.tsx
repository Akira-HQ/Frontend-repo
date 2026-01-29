"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Zap, CheckCircle, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/components/AppContext';
import { UseAPI } from '@/components/hooks/UseAPI';
import { PLAN_CONFIG } from '@/utils/checkPlan';
import { ClivaStarsBackground } from '@/components/Stars';

const PaystackButton = dynamic(() => import('@/components/hooks/PayStackButton'), { ssr: false });

const UpgradePlanPage: React.FC = () => {
  const router = useRouter();
  const { addToast, user, setUser } = useAppContext();
  const { callApi } = UseAPI();

  const [selectedPlanKey, setSelectedPlanKey] = useState<string>('BASIC');
  const [loading, setLoading] = useState(false);
  const [showManualRef, setShowManualRef] = useState(false);
  const [manualRef, setManualRef] = useState("");

  const currentPlan = user?.plan?.toUpperCase() || 'FREE';
  const storeId = user?.store?.id;
  const isPaidPlanSelected = PLAN_CONFIG[selectedPlanKey as keyof typeof PLAN_CONFIG]?.price > 0;
  const US_TO_NGN_RATE = 1600;

  

  const finalizeUpgrade = async (reference: string) => {
    setLoading(true);
    addToast("Verifying payment with Cliva servers...", "loading");
    try {
      const response = await callApi("/upgrade-plan", "PATCH", {
        plan: selectedPlanKey,
        storeId: storeId,
        paystackReference: reference,
      });

      addToast(response.message, "success");

      // ⚡️ CRITICAL: Fetch fresh user data so the AuthGuard sees the 'is_paid: true'
      const freshUser = await callApi("/verify-session", "GET");
      setUser(freshUser.user);

      // Now redirect
      router.push('/dashboard');
    } catch (error: any) {
      addToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 px-4 bg-[#050505] relative min-h-screen">
      <ClivaStarsBackground density={200} />
      <div className="relative max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white text-center mb-10 flex items-center justify-center gap-3">
          <Zap className="w-8 h-8 text-[#A500FF]" /> Upgrade Cliva
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {Object.entries(PLAN_CONFIG).map(([key, details]: [string, any]) => (
            <div key={key}
              className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${selectedPlanKey === key ? 'bg-[#A500FF]/10 border-[#A500FF]' : 'bg-gray-900 border-gray-800'}`}
              onClick={() => setSelectedPlanKey(key)}>
              <h3 className="text-xl font-bold text-white uppercase">{key}</h3>
              <p className="text-3xl font-black text-white mt-2">${details.price}</p>
              <ul className="mt-4 space-y-2">
                {details.features.map((f: string, i: number) => (
                  <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-xl mx-auto p-8 rounded-2xl bg-gray-900 border border-gray-800 text-center">
          {!showManualRef ? (
            <>
              <PaystackButton
                loading={loading}
                email={user?.email || ""}
                amount={(PLAN_CONFIG[selectedPlanKey as keyof typeof PLAN_CONFIG]?.price || 0) * US_TO_NGN_RATE * 100}
                onSuccess={(ref) => finalizeUpgrade(ref.reference)}
                onClose={() => addToast("Payment Window Closed", "info")}
                isPaidPlanSelected={isPaidPlanSelected}
              />
              <button
                onClick={() => setShowManualRef(true)}
                className="mt-6 text-sm text-gray-500 hover:text-[#A500FF] transition flex items-center justify-center gap-2 w-full"
              >
                <HelpCircle className="w-4 h-4" /> I've already paid for this plan
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">Enter the Reference ID from your Paystack receipt:</p>
              <input
                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-[#A500FF]"
                placeholder="cliva_123456789"
                value={manualRef}
                onChange={(e) => setManualRef(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => finalizeUpgrade(manualRef)} className="flex-1 bg-[#A500FF] py-3 rounded-lg font-bold">Confirm Payment</button>
                <button onClick={() => setShowManualRef(false)} className="px-4 bg-gray-800 rounded-lg">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpgradePlanPage;