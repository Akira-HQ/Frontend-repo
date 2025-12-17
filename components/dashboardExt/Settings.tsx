"use client";
import React, { useState } from "react";
import {
  TrendingUp,
  Zap,
  Clock,
  AlertTriangle,
  MessageCircle,
  DollarSign,
  XCircle,
  CheckCircle,
} from "lucide-react";
import QuotaMonitor from "./Settings/QuotaManager";

const NEON_PURPLE = "#A500FF";
const NEON_ORANGE = "#FFB300";
const ACCENT_BLUE = "#00A7FF";

// =============================================================
// 2. SETTINGS COMPONENT (Main Orchestrator)
// =============================================================

const Settings = () => {
  // Using query params to manage the 'page' for deep linking, but using local state for simplicity in this component
  const [activeTab, setActiveTab] = useState("usage");

  return (
    <div className="py-4 px-2 w-full h-full text-white pt-10 ml-6 relative">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      {/* Settings Navigation Tabs */}
      <div className="flex space-x-6 border-b border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab("usage")}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === "usage"
              ? `text-[${NEON_ORANGE}] border-b-2 border-[${NEON_ORANGE}]`
              : "text-gray-400 hover:text-white"
          }`}
        >
          Usage & Billing Quota
        </button>
        <button
          onClick={() => setActiveTab("general")}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === "general"
              ? `text-[${NEON_ORANGE}] border-b-2 border-[${NEON_ORANGE}]`
              : "text-gray-400 hover:text-white"
          }`}
        >
          General & Security
        </button>
        {/* ADDED: Placeholder for future Billing History */}
        <button
          onClick={() => setActiveTab("billing")}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === "billing"
              ? `text-[${NEON_ORANGE}] border-b-2 border-[${NEON_ORANGE}]`
              : "text-gray-400 hover:text-white"
          }`}
        >
          Payment & History
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "usage" && <QuotaMonitor />}

      {activeTab === "general" && (
        <div className="p-6 bg-[#0b0b0b] rounded-xl border border-gray-800 min-h-[500px]">
          <h2 className="text-xl font-bold">General Account Management</h2>
          <p className="text-gray-400 mt-2">
            Store details, password reset, and user access control go here.
          </p>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="p-6 bg-[#0b0b0b] rounded-xl border border-gray-800 min-h-[500px]">
          <h2 className="text-xl font-bold">
            Payment Methods & Invoice History
          </h2>
          <p className="text-gray-400 mt-2">
            Add payment methods and review past invoices.
          </p>
        </div>
      )}
    </div>
  );
};

export default Settings;
