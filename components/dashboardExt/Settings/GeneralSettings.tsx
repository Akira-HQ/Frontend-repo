"use client";
import React, { useState } from "react";
import { User, Shield, Key, Globe, LogOut, RefreshCw, Mail, CheckCircle } from "lucide-react";
import { useAppContext } from "@/components/AppContext";
import { UseAPI } from "@/components/hooks/UseAPI";

export const GeneralSecurity = () => {
  const { user, addToast, logout } = useAppContext(); // Added logout from context
  const { callApi } = UseAPI();
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Identity State (Linked to your PATCH /edit route)
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    id: user?.id // Required by your PATCH /edit route
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.name) return addToast("Name cannot be empty.", "error");

    setLoading(true);
    try {
      // Logic mapped to your router.patch("/edit")
      const res = await callApi("/edit", "PATCH", {
        id: profile.id,
        name: profile.name,
        email: profile.email
      });

      if (res.message === "Updated successfully") {
        addToast("Strategic identity synchronized.", "success");
      }
    } catch (err) {
      addToast("Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    setResetLoading(true);
    try {
      // Logic mapped to your router.post("/user/forgot-password")
      await callApi("/user/forgot-password", "POST", { email: user?.email });
      addToast("Reset code dispatched to your email.", "success");
    } catch (err) {
      addToast("Security gateway error. Try again later.", "error");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* 1. IDENTITY MODULE (PATCH /edit) */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 rounded-xl bg-[#A500FF]/10 text-[#A500FF] border border-[#A500FF]/20">
            <User size={20} />
          </div>
          <div>
            <h3 className="text-white font-black uppercase italic tracking-tighter">Strategic Identity</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Update your platform presence</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Account Holder</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-[#A500FF] transition-all"
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Gateway Email</label>
            <div className="relative">
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 px-6 text-gray-500 text-sm outline-none cursor-not-allowed"
              />
              <Shield size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-green-500/40" />
            </div>
          </div>
          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#A500FF] hover:text-white transition-all active:scale-95 flex items-center gap-2"
            >
              {loading ? <RefreshCw className="animate-spin" size={14} /> : "Update Details"}
            </button>
          </div>
        </form>
      </div>

      {/* 2. SECURITY PROTOCOL (forgot-password & sessions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Password Reset Trigger */}
        <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-10 group hover:border-[#A500FF]/30 transition-all">
          <Key className="text-[#A500FF] mb-6" size={24} />
          <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-widest">Credentials</h4>
          <p className="text-xs text-gray-500 mb-8 leading-relaxed">Request a secure encrypted reset code to your registered email to update your access key.</p>
          <button
            onClick={handlePasswordResetRequest}
            disabled={resetLoading}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex justify-center items-center gap-2"
          >
            {resetLoading ? <RefreshCw className="animate-spin" size={12} /> : "Request Reset Code"}
          </button>
        </div>

        {/* Global Session Termination */}
        <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] p-10 group hover:border-red-500/30 transition-all">
          <Globe className="text-blue-500 mb-6" size={24} />
          <h4 className="text-white font-bold text-sm mb-2 uppercase tracking-widest">Active Access</h4>
          <p className="text-xs text-gray-500 mb-8 leading-relaxed">Currently active on **{user?.store?.platform || 'Web'}**. Terminate your current session and secure your account.</p>
          <button
            onClick={() => logout()}
            className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            Sign Out Current Session
          </button>
        </div>
      </div>

    </div>
  );
};