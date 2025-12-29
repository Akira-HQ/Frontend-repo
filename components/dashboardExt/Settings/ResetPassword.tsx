"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Shield, Key, RefreshCw, CheckCircle, Eye, EyeOff } from "lucide-react";
import { UseAPI } from "@/components/hooks/UseAPI";

// ⚡️ Inner component to handle the SearchParams logic
const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { callApi } = UseAPI();

  const [form, setForm] = useState({
    email: searchParams.get("email") || "",
    code: searchParams.get("code") || "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto-verify/fill if params are present
  useEffect(() => {
    if (searchParams.get("code")) {
      // You could trigger a code verification API here if desired
    }
  }, [searchParams]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match.");
    }

    setLoading(true);
    try {
      const res = await callApi("/user/reset-password", "POST", {
        email: form.email,
        code: form.code,
        password: form.password,
      });

      if (res.message.includes("successfully")) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (err) {
      alert("Invalid code or session expired.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Security Restored</h2>
          <p className="text-gray-500 text-sm uppercase font-bold tracking-widest">Redirecting to gateway...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#A500FF] to-transparent opacity-50" />

        <div className="mb-10 text-center">
          <div className="w-12 h-12 bg-[#A500FF]/10 border border-[#A500FF]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="text-[#A500FF]" size={24} />
          </div>
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Credential Reset</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Finalize security update</p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          {/* Email (Read Only usually) */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Account Email</label>
            <input
              type="email"
              value={form.email}
              readOnly
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-gray-500 text-sm outline-none"
            />
          </div>

          {/* Code Input */}
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Authorization Code</label>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[#A500FF] text-2xl font-black tracking-[0.5em] text-center outline-none focus:border-[#A500FF] transition-all"
            />
          </div>

          {/* New Password */}
          <div className="space-y-2 relative">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">New Access Key</label>
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-[#A500FF] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-[38px] text-gray-600 hover:text-white"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#A500FF] hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="animate-spin" size={14} /> : "Update Credentials"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ⚡️ Main exported component with Suspense Boundary
const ResetPasswordPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RefreshCw className="text-[#A500FF] animate-spin" size={32} />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;