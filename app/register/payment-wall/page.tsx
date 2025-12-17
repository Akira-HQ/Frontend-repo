"use client";
import React from 'react';
import PaymentWall from '../../../components/registrationHook/Payment';
// Adjust the import path for PaymentWall based on where you saved it!

const PaymentWallPage = () => {
  // The layout should match your registration page layout (e.g., centered, dark background)
  return (
    <div className="min-h-screen flex items-center justify-center p-4 main-bg">
      <PaymentWall />
    </div>
  );
};

export default PaymentWallPage;