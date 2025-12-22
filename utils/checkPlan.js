// utils/planConfig.ts
export const PLAN_CONFIG = {
  FREE: {
    title: "Free",
    price: 0,
    queryLimit: 100,
    description: "Forever free tier, great for small shops.",
    features: [
      "Basic Analytics",
      "1,000 AI Queries/Month", // Updated to 1000 per your edit
      "Basic Tracking",
    ],
  },
  BASIC: {
    title: "Basic",
    price: 10,
    queryLimit: 10000,
    description: "Essential tools for growing your sales.",
    features: [
      "Up to 5,000 sessions/mo",
      "Advanced Recommendations",
      "Automated Follow-ups",
      "Sales Analytics",
    ],
  },
  PREMIUM: {
    title: "Pro",
    price: 20,
    queryLimit: 50000,
    description: "Full-scale intelligence for high-volume stores.",
    features: [
      "Up to 15,000 sessions/mo", // Adjusted to match your queryLimit
      "Advanced A/B Testing",
      "Custom API Access",
      "Priority VIP Support",
    ],
  },
};

export const GRACE_PERIOD_DAYS = 7;
