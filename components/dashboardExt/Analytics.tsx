"use client";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import {
  ACCENT_BLUE,
  CHART_GRID_COLOR,
  NEON_ORANGE,
  NEON_PURPLE,
  TEXT_GRAY,
} from "@/types";
import SummaryCards from "./Analytics/SummaryCards";
import AnalyticsFilters from "./Analytics/AnalyticsFilters";
import UsersLineChart from "./Analytics/UsersLineChart";
import RevenueBarChart from "./Analytics/RevenueBarChart";
import TrafficDonutChart from "./Analytics/TrafficDonut";
import KpiBreakdown from "./Analytics/KpiBreakdown";
import RecentActivityTable from "./Analytics/RecentActivity";
import CustomerSegmentsChart from "./Analytics/CustomerSegmentation";

const Analytics = () => {
  // NOTE: This component does not need useAppContext if it's placed inside a themed provider
  return (
    <div className="py-4 px-2 w-full h-full text-white pt-10 ml-6 relative">
      <h1 className="text-3xl font-bold mb-6">Cliva Performance Analytics</h1>
      <p className="text-gray-400 mb-8 max-w-2xl">
        Review the impact of the AI sales manager on your core business metrics,
        user behavior, and revenue trends.
      </p>

      <main className="space-y-6">
        <SummaryCards />

        <AnalyticsFilters />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UsersLineChart />
          <RevenueBarChart />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TrafficDonutChart />
          <KpiBreakdown />
        </div>

        <RecentActivityTable />
        <CustomerSegmentsChart />
      </main>
    </div>
  );
};

export default Analytics;
