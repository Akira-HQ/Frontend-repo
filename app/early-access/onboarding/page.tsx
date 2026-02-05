"use client";
import { useRouter } from "next/navigation";
import { Card, Input, PrimaryButton, StepIndicator } from "@/components/onboarding/UI";
import { Sparkles, ArrowRight } from "lucide-react";

export default function AccessPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#08090a] flex items-center justify-center p-6 relative">
      {/* <div className="absolute top-10 left-10">
        <h1 className="text-2xl font-black italic tracking-tighter text-white">CLIVA</h1>
      </div> */}

      <Card>
        <StepIndicator current={1} />
        <h2 className="text-2xl font-bold text-white mb-2">Enter your early access code</h2>
        <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
          This access is limited to a small group of early Shopify stores.
        </p>

        <div className="space-y-4">
          <Input placeholder="Enter access code" />
          <PrimaryButton onClick={() => router.push("/onboarding/connect-store")}>
            Verify access <ArrowRight size={18} />
          </PrimaryButton>
        </div>

        <p className="mt-8 text-center text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
          Don’t have a code? <span className="text-[#00A7FF] cursor-pointer">Contact support</span>
        </p>
      </Card>
    </main>
  );
}