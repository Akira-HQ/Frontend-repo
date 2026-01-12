export const dummyData = {
  // SummaryCards.tsx: The "Big 4" metrics
  summary: [
    {
      title: "Neural Reach",
      subtitle: "Total Unique Users",
      value: "14,280",
      change: 12.5,
      trend: 1,
    },
    {
      title: "Generated Revenue",
      subtitle: "Last 30 Days",
      value: "$42,650",
      change: 8.2,
      trend: 1,
    },
    {
      title: "Conversion IQ",
      subtitle: "AI Success Rate",
      value: "94.2%",
      change: 2.1,
      trend: 1,
    },
    {
      title: "Live Pulses",
      subtitle: "Active Sessions",
      value: "184",
      change: 0,
      trend: 0,
    },
  ],

  // KpiBreakdown.tsx: Neural Diagnostics
  kpis: {
    latency: "380ms",
    sentiment: "91%",
    resolution: "78%",
  },

  charts: {
    // UsersLineChart.tsx: Acquisition Flow
    userGrowth: [
      { name: "Jan 05", users: 420 },
      { name: "Jan 06", users: 580 },
      { name: "Jan 07", users: 490 },
      { name: "Jan 08", users: 710 },
      { name: "Jan 09", users: 850 },
      { name: "Jan 10", users: 920 },
      { name: "Jan 11", users: 1100 },
    ],
    // TrafficDonutChart.tsx: Acquisition Origin
    traffic: [
      { name: "Direct", value: 450, color: "#A500FF" },
      { name: "Organic Search", value: 320, color: "#00A7FF" },
      { name: "Social Pulse", value: 280, color: "#FFB300" },
      { name: "Referral", value: 150, color: "#FF4D4D" },
    ],
    // RevenueBarChart.tsx: Revenue Velocity
    revenue: [
      { name: "Mon", revenue: 4200 },
      { name: "Tue", revenue: 3800 },
      { name: "Wed", revenue: 5100 },
      { name: "Thu", revenue: 4600 },
      { name: "Fri", revenue: 6200 },
      { name: "Sat", revenue: 7800 },
      { name: "Sun", revenue: 5900 },
    ],
  },

  // CustomerSegmentsChart.tsx: Neural Personas
  segments: [
    {
      name: "Fast Deciders",
      count: 180,
      AOV_Factor: 1.4,
      color: "#FFB300",
      strategy: "Deploying high-scarcity triggers and express checkout paths.",
    },
    {
      name: "Loyalty Tier 1",
      count: 95,
      AOV_Factor: 1.8,
      color: "#A500FF",
      strategy: "Unlocking exclusive early-access inventory and VIP status.",
    },
    {
      name: "Price Sensitive",
      count: 320,
      AOV_Factor: 0.9,
      color: "#00A7FF",
      strategy:
        "Highlighting financing options and multi-buy bundle discounts.",
    },
    {
      name: "Feature Inquirer",
      count: 150,
      AOV_Factor: 1.1,
      color: "#FF4D4D",
      strategy:
        "Providing deep-technical specs and automated comparison charts.",
    },
  ],

  // RecentActivityTable.tsx: Event Stream
  activities: [
    {
      user: "Visitor #492a",
      action: "Added 'Neon Cyber-Cap' to Cart",
      date: "2 mins ago",
      status: "success",
    },
    {
      user: "Visitor #110b",
      action: "Neural Logic: Price Negotiation Started",
      date: "5 mins ago",
      status: "warning",
    },
    {
      user: "System",
      action: "RAG Inventory Index Re-Sync Completed",
      date: "12 mins ago",
      status: "success",
    },
    {
      user: "Visitor #882c",
      action: "Checkout Initiated: Stripe Link Sent",
      date: "1 hour ago",
      status: "success",
    },
    {
      user: "Visitor #001x",
      action: "Exit Intent Detected: Discount Triggered",
      date: "2 hours ago",
      status: "error",
    },
  ],
};