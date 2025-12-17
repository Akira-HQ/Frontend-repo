"use client";
import React, { Suspense } from 'react';
import PaymentWall from '../../../components/registrationHook/Payment';
import { Loader2 } from 'lucide-react';
// Adjust the import path for PaymentWall based on where you saved it!

const PaymentWallPage = () => {
  // The layout should match your registration page layout (e.g., centered, dark background)
  return (
    <div className="min-h-screen flex items-center justify-center p-4 main-bg">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center text-white gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#FFB300]" />
          <p className="text-gray-400 animate-pulse">Loading secure payment wall...</p>
        </div>
      }>
        <PaymentWall />
      </Suspense>
    </div>
  );
};

export default PaymentWallPage;