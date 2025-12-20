"use client";
import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { UseAPI } from "../hooks/UseAPI"; // Adjust the import path as necessary

export default function WaitlistForm() {
  const { callApi } = UseAPI(); // Use your custom hook
  const [formData, setFormData] = useState({
    email: "",
    storeUrl: "",
    role: "Founder"
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Using your callApi helper
      const response = await callApi("/join", "POST", formData);

      if (response && response.success) {
        setSubmitted(true);
      } else {
        setError(response?.message || "Failed to join waitlist.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-12 text-center rounded-3xl border border-amber-500/20 bg-amber-500/[0.02] animate-in fade-in zoom-in duration-500">
        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <ArrowRight className="text-black w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold mb-2">You're on the list.</h2>
        <p className="text-gray-500">We'll notify you when Cliva is ready for your store.</p>
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
        <input
          required
          type="email"
          placeholder="Work email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-6 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl outline-none focus:border-amber-500/50 transition-all text-white placeholder:text-gray-600"
        />

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Store URL"
            value={formData.storeUrl}
            onChange={(e) => setFormData({ ...formData, storeUrl: e.target.value })}
            className="w-1/2 px-6 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl outline-none focus:border-amber-500/50 transition-all text-white placeholder:text-gray-600"
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-1/2 px-6 py-4 bg-[#050505] border border-white/[0.08] rounded-2xl outline-none focus:border-amber-500/50 transition-all text-gray-400  appearance-none cursor-pointer"
          >
            <option value="Founder">Founder</option>
            <option value="Marketer">Marketer</option>
            <option value="Dev">Dev</option>
          </select>
        </div>

        {error && (
          <p className="text-red-500/80 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
            {error}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Request Early Access"}
        </button>
      </form>
    </div>
  );
}