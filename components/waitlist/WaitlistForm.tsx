"use client";
import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-12 text-center rounded-3xl border border-amber-500/20 bg-amber-500/[0.02]">
        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ArrowRight className="text-black w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold mb-2">You're on the list.</h2>
        <p className="text-gray-500">We'll notify you when Akira is ready for your store.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Join the Waitlist</h2>
        <p className="text-gray-500">Limited spots available for our private beta.</p>
      </div>

      <form onSubmit={handleJoin} className="space-y-4">
        <div className="relative group">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email"
            className="w-full px-6 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl outline-none focus:border-amber-500/50 transition-all text-white placeholder:text-gray-600"
          />
        </div>

        <div className="flex gap-4">
          <input type="text" placeholder="Store URL" className="w-1/2 px-6 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl outline-none focus:border-amber-500/50 transition-all text-white placeholder:text-gray-600" />
          <select className="w-1/2 px-6 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl outline-none focus:border-amber-500/50 transition-all text-gray-500 appearance-none">
            <option>Founder</option>
            <option>Marketer</option>
            <option value="">Dev</option>
          </select>
        </div>

        <button
          disabled={loading}
          className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Request Early Access"}
        </button>
      </form>
    </div>
  );
}