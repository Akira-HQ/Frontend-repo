"use client";
import React, { useState, useEffect, useMemo } from "react"; // ⚡️ Added useMemo
import { Loader2, Zap, Activity, BrainCircuit, RefreshCcw } from "lucide-react";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";
import { dummyData } from "@/utils/dummyData";

// Sub-components
import SummaryCards from "./Analytics/SummaryCards";
import AnalyticsFilters from "./Analytics/AnalyticsFilters";
import UsersLineChart from "./Analytics/UsersLineChart";
import RevenueBarChart from "./Analytics/RevenueBarChart";
import TrafficDonutChart from "./Analytics/TrafficDonut";
import KpiBreakdown from "./Analytics/KpiBreakdown";
import RecentActivityTable from "./Analytics/RecentActivity";
import CustomerSegmentsChart from "./Analytics/CustomerSegmentation";

const Analytics = () => {
  const { user } = useAppContext();
  const { callApi } = UseAPI();

  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("30days");
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState(""); // ⚡️ New state for search

  const fetchAnalytics = async () => {
    const storeId = user?.store?.id || user?.id;
    console.log("Step 1: Store ID found:", storeId);

    setLoading(true);
    try {
      const res = await callApi(
        `/pulse/analytics/dashboard?storeId=${storeId}&range=${timeframe}`,
        "GET"
      );

      console.log("Step 2: API Response:", res);

      if (res && Object.keys(res).length > 0) {
        setData(res);
      } else {
        console.warn("Step 3: No real data found. Loading Dummy Data.");
        setData(dummyData);
      }
    } catch (err) {
      console.error("Step 4: API Error:", err);
      setData(dummyData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user?.store?.id, timeframe]);

  // ⚡️ Logic to filter activities based on the search term
  const filteredActivities = useMemo(() => {
    if (!data?.activities) return [];
    if (!searchTerm.trim()) return data.activities;

    const query = searchTerm.toLowerCase();
    return data.activities.filter((activity: any) =>
      activity.user?.toLowerCase().includes(query) ||
      activity.action?.toLowerCase().includes(query) ||
      activity.status?.toLowerCase().includes(query)
    );
  }, [data?.activities, searchTerm]);

  if (loading && !data) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#050505]">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-[#A500FF] animate-spin" />
          <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-6 h-6" />
        </div>
        <p className="text-[10px] mt-6 font-black uppercase tracking-[0.5em] text-gray-500 animate-pulse">
          Synchronizing Neural Performance Data
        </p>
      </div>
    );
  }

  return (
    <div className="analytics-container py-8 px-6 w-full h-full text-white relative overflow-y-auto bg-[#0b0b0b]">
      <style jsx global>{`
        .analytics-container::-webkit-scrollbar { width: 6px; }
        .analytics-container::-webkit-scrollbar-track { background: #050505; }
        .analytics-container::-webkit-scrollbar-thumb { background: #A500FF; border-radius: 10px; }
        .analytics-container::-webkit-scrollbar-thumb:hover { background: #7a00bd; }
      `}</style>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A500FF]/10 blur-[150px] -z-10 pointer-events-none" />

      <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Neural Link Active</span>
            </div>
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">
            Performance <span className="text-[#A500FF]">Analytics</span>
          </h1>
        </div>

        <button
          onClick={fetchAnalytics}
          className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all"
        >
          <RefreshCcw className={`w-5 h-5 text-[#A500FF] ${loading ? 'animate-spin' : ''}`} />
          <div className="text-left">
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">System Status</p>
            <p className="text-sm font-black uppercase tracking-tighter text-white">Refresh Stream</p>
          </div>
        </button>
      </header>

      <main className="space-y-10 pb-24">
        <SummaryCards data={data?.summary || []} />

        <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded-2xl border border-white/5">
          {/* ⚡️ Added onSearch prop to handle the search input */}
          <AnalyticsFilters
            current={timeframe}
            onChange={setTimeframe}
            onSearch={setSearchTerm}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-3xl p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">User Acquisition Flow</h3>
            <UsersLineChart data={data?.charts?.userGrowth || []} />
          </div>
          <div className="lg:col-span-4">
            <KpiBreakdown data={data?.kpis || {}} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white/[0.02] border border-white/5 rounded-3xl p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Source Attribution</h3>
            <TrafficDonutChart data={data?.charts?.traffic || []} />
          </div>
          <div className="lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-3xl p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-6">Revenue Conversion</h3>
            <RevenueBarChart data={data?.charts?.revenue || []} />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <CustomerSegmentsChart data={data?.segments || []} />
          {/* ⚡️ Passing the filtered list instead of the raw data list */}
          <RecentActivityTable data={filteredActivities} />
        </div>
      </main>
    </div>
  );
};

export default Analytics;