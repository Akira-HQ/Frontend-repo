"use client";
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Zap,
  Clock,
  AlertTriangle,
  MessageCircle,
  DollarSign,
  XCircle,
} from "lucide-react";

const NEON_PURPLE = "#A500FF";
const NEON_ORANGE = "#FFB300";
const ACCENT_BLUE = "#0066FF";

interface QuotaItem {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit: string;
}

interface ServiceStatus {
  id: string;
  label: string;
  status: "Operational" | "Degraded" | "Offline";
  detail: string;
}

// --- MOCK DATA ---
const MOCK_QUOTAS: QuotaItem[] = [
  {
    id: "messages",
    label: "AI Messages (Monthly)",
    used: 4500,
    limit: 10000,
    unit: "messages",
  },
  {
    id: "rag_queries",
    label: "RAG Queries (Monthly)",
    used: 800,
    limit: 1000,
    unit: "queries",
  },
  {
    id: "compute",
    label: "Proactive Compute Time",
    used: 32,
    limit: 40,
    unit: "hours",
  },
];

const MOCK_SERVICES: ServiceStatus[] = [
  {
    id: "gemini_api",
    label: "Gemini AI Core API",
    status: "Operational",
    detail: "Primary conversational engine latency: < 50ms.",
  },
  {
    id: "webhook_sync",
    label: "Shopify Webhook Sync",
    status: "Operational",
    detail: "Real-time sync active.",
  },
  {
    id: "rate_limit",
    label: "API Rate Limit Status",
    status: "Operational",
    detail: "Currently running below 50% threshold.",
  },
];
// --- END MOCK DATA ---

const getQuotaColor = (used: number, limit: number) => {
  const ratio = used / limit;
  if (ratio >= 0.9) return "bg-red-500"; // Critical (Needs upgrade)
  if (ratio >= 0.75) return "bg-yellow-500"; // Warning
  return "bg-green-500"; // Healthy
};

const QuotaProgressBar: React.FC<{ item: QuotaItem }> = ({ item }) => {
  const percentage = (item.used / item.limit) * 100;
  const colorClass = getQuotaColor(item.used, item.limit);

  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 shadow-md">
      <h3 className="text-sm text-gray-400 font-medium flex items-center justify-between">
        {item.label}
        <span
          className={`text-xs font-semibold ${percentage >= 90 ? "text-red-400" : "text-gray-300"}`}
        >
          {percentage.toFixed(0)}% Used
        </span>
      </h3>

      <div className="flex items-center space-x-3 mt-2">
        <Zap className="w-5 h-5 text-[#A500FF] flex-shrink-0" />
        <div className="flex-1 bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${colorClass}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {item.used} / {item.limit} {item.unit}
      </p>
    </div>
  );
};

const ServiceStatusItem: React.FC<{ service: ServiceStatus }> = ({
  service,
}) => {
  let indicator: React.ReactNode;
  let textColor: string;

  switch (service.status) {
    case "Operational":
      indicator = <Zap className="w-4 h-4 text-green-400" />;
      textColor = "text-green-400";
      break;
    case "Degraded":
      indicator = <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      textColor = "text-yellow-400";
      break;
    case "Offline":
      indicator = <XCircle className="w-4 h-4 text-red-400" />;
      textColor = "text-red-400";
      break;
  }

  return (
    <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 flex items-center space-x-3">
      {indicator}
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{service.label}</p>
        <p className={`text-xs ${textColor}`}>{service.status}</p>
      </div>
      <span className="text-xs text-gray-500 max-w-[50%] truncate">
        {service.detail}
      </span>
    </div>
  );
};

const QuotaMonitor: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* 1. Monthly Quota Consumption Meters */}
      <div className="bg-[#0b0b0b] rounded-xl p-6 shadow-2xl border border-gray-800">
        <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-3 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#FFB300]" /> AI Usage & Quota
          Management (Growth Plan)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_QUOTAS.map((item) => (
            <QuotaProgressBar key={item.id} item={item} />
          ))}
        </div>

        {/* Billing CTA/Warning */}
        <div className="mt-8 pt-4 border-t border-gray-800 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Approaching monthly limits? Upgrade now to prevent service
            degradation.
          </p>
          <a
            href="/pricing"
            className={`px-4 py-2 text-sm font-bold rounded-lg text-white 
                            bg-gradient-to-r from-[#0066FF] to-[#A500FF] hover:from-[#A500FF] hover:to-[#FFB300] transition shadow-md shadow-purple-900/50`}
          >
            Upgrade Plan
          </a>
        </div>
      </div>

      {/* 2. Real-Time Service Health Status */}
      <div className="bg-[#0b0b0b] rounded-xl p-6 shadow-2xl border border-gray-800">
        <h2 className="text-xl font-bold mb-6 border-b border-gray-800 pb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" /> Real-Time Service
          Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_SERVICES.map((service) => (
            <ServiceStatusItem key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuotaMonitor;
