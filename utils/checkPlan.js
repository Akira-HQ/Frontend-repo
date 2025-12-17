// utils/checkPlan.js
export const PLAN_CONFIG = {
  FREE: {
    price: 0,
    queryLimit: 100,
    description: "Forever free tier, great for small shops.",
    features: ["Basic Analytics", "100 AI Queries/Month", "Basic Tracking"],
  },
  BASIC: {
    price: 10,
    queryLimit: 10000,
    description: "Essential tools for growing your sales.",
    features: [
      "Up to 10,000 sessions/mo",
      "Multi-Platform Integration",
      "Advanced Recommendations",
      "Automated Follow-ups",
      "Sales Analytics",
    ],
  },
  PREMIUM: {
    // Aligned with 'Pro' UI label
    price: 20,
    queryLimit: 50000,
    description: "Full-scale intelligence for high-volume stores.",
    features: [
      "Unlimited Sessions",
      "Voice Conversation Support",
      "Dedicated Account Manager",
      "Advanced A/B Testing",
      "Custom API Access",
      "Priority VIP Support",
    ],
  },
};

export const GRACE_PERIOD_DAYS = 7;
