// --- shared/config/plans.js ---

// NOTE: This file is used by both the frontend UI and backend processing logic.
export const PLAN_CONFIG = {
  FREE: {
    price: 0,
    queryLimit: 100,
    description: "Forever free tier, great for small shops.",
    features: ["Basic Analytics", "100 AI Queries/Month", "Basic Tracking"],
  },
  BASIC: {
    price: 49,
    queryLimit: 5000,
    description: "Essential tools for growing your sales.",
    features: [
      "5,000 AI Queries/Month",
      "Product Analysis",
      "Real-Time Tracking",
      "Standard Support",
    ],
  },
  PREMIUM: {
    price: 99,
    queryLimit: 50000,
    description: "Full-scale intelligence for high-volume stores.",
    features: [
      "50,000 AI Queries/Month",
      "Full RL Feedback Loop",
      "Dedicated Account Manager",
      "Priority Support",
    ],
  },
  UNLIMITED: {
    price: 299,
    queryLimit: Infinity,
    description: "Maximum performance and resources.",
    features: ["Unlimited AI Queries", "All Features", "Dedicated Manager"],
  },
};

// --- Expiration and Grace Period (in days) ---
export const GRACE_PERIOD_DAYS = 7;
