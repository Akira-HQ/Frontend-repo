"use client";

import React from "react";
import { Loader } from "@/components/ui/Loader";
import { ClivaStarsBackground } from "@/components/Stars";
import RegisterContent from "@/components/RegisterForm";

const RegistrationPage = () => {
  return (
    <div className="min-h-screen font-inter bg-[#050505] antialiased overflow-x-hidden relative flex items-center justify-center p-4">
      {/* 1. Nebula Background Effect */}
      <ClivaStarsBackground density={200} />

      {/* 2. Main Content Wrapper */}
      <div className="py-12 w-full max-w-xl">
        <React.Suspense fallback={<Loader />}>
          <RegisterContent />
        </React.Suspense>
      </div>
    </div>
  );
};

export default RegistrationPage;
