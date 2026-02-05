"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, PrimaryButton, StepIndicator } from "@/components/onboarding/UI";
import { CheckCircle2, CircleDashed } from "lucide-react";

export default function SettingUpPage() {
  const router = useRouter();
  const [complete, setComplete] = useState(false);

  // Mock progress simulation
  useEffect(() => {
    const timer = setTimeout(() => setComplete(true), 4500);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    { label: "Reading product catalog", done: true },
    { label: "Understanding pricing & variants", done: true },
    { label: "Preparing sales insights", done: complete },
  ];

  return (
    <main className="min-h-screen bg-[#08090a] flex items-center justify-center p-6">
      <Card className="text-center">
        <div className="flex justify-center"><StepIndicator current={3} /></div>

        <div className="mb-6 flex justify-center">
          {!complete ? (
            <CircleDashed className="text-[#A500FF] animate-spin" size={48} />
          ) : (
            <CheckCircle2 className="text-emerald-500 animate-in zoom-in duration-500" size={48} />
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {complete ? "Store Integrated" : "Cliva is learning your store"}
        </h2>
        <p className="text-neutral-500 text-sm mb-10 max-w-[280px] mx-auto">
          We’re analyzing your product architecture to provide surgical sales assistance.
        </p>

        <div className="space-y-4 mb-10">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 text-left p-3 rounded-2xl border ${s.done ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-white/5 border-white/5 opacity-50'}`}>
              <CheckCircle2 size={16} className={s.done ? "text-emerald-500" : "text-neutral-700"} />
              <span className={`text-xs font-medium ${s.done ? "text-neutral-200" : "text-neutral-500"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {complete ? (
          <PrimaryButton onClick={() => router.push("/dashboard")}>
            Go to dashboard
          </PrimaryButton>
        ) : (
          <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-[0.2em] animate-pulse">
            Analysis in progress...
          </p>
        )}
      </Card>
    </main>
  );
}