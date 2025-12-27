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
import {QuotaMonitor} from "./Settings/QuotaManager";
import { useAppContext } from "../AppContext";
import { GeneralSecurity } from "./Settings/GeneralSettings";
import { PaymentHistory } from "./Settings/PaymentHistory";

const NEON_PURPLE = "#A500FF";
const NEON_ORANGE = "#FFB300";
const ACCENT_BLUE = "#00A7FF";

// =============================================================
// 2. SETTINGS COMPONENT (Main Orchestrator)
// =============================================================

const Settings = () => {
  // Using query params to manage the 'page' for deep linking, but using local state for simplicity in this component
  const [activeTab, setActiveTab] = useState("usage");
  const {user} = useAppContext()

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
        <GeneralSecurity />
      )}

      {activeTab === "billing" && (
        <PaymentHistory />
      )}
    </div>
  );
};

export default Settings;
