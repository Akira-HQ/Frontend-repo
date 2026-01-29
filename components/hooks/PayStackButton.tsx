"use client";
import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Rocket, Loader2 } from 'lucide-react';

interface PaystackButtonProps {
  amount: number;
  email: string;
  onSuccess: (ref: any) => void;
  onClose: () => void;
  loading: boolean;
  isPaidPlanSelected: boolean;
  planName?: string; // Added this to fix TS Error
}

const PaystackButton = ({
  amount,
  email,
  onSuccess,
  onClose,
  loading,
  isPaidPlanSelected,
  planName
}: PaystackButtonProps) => {

  const config = {
    reference: `cliva_${new Date().getTime()}`,
    email: email,
    amount: amount,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    currency: "NGN",
  };

  const initializePayment = usePaystackPayment(config);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => isPaidPlanSelected ? initializePayment({ onSuccess, onClose }) : onSuccess({ reference: 'FREE_ACTIVATION' })}
      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${loading
          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-[#A500FF] via-[#00A7FF] to-[#A500FF] bg-[length:200%_auto] hover:bg-right text-white active:scale-[0.98] shadow-purple-500/20'
        }`}
    >
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <>
          <Rocket className="w-5 h-5" />
          Activate {planName}
        </>
      )}
    </button>
  );
};

export default PaystackButton;