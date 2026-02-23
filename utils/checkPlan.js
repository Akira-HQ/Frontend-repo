export const PLAN_CONFIG = {
  FREE: {
    title: "Free",
    price: 0,
    queryLimit: 15, // per day
    description:
      "Experience how Cliva supports customer decisions inside your store.",
    features: [
      "Up to 15 AI actions per day",
      "Live store chat (limited)",
      "1 product insight per day",
      "Basic product analysis",
      "Shopify integration",
    ],
  },

  BASIC: {
    title: "Basic",
    price: 15, // early access price
    queryLimit: 120, // per day
    description: "AI-powered sales intelligence for growing Shopify stores.",
    features: [
      "Up to 120 AI actions per day",
      "Full live store chat",
      "Up to 5 product insights per day",
      "1 deep product audit per day",
      "Store-wide performance summary",
      "Conversion analytics dashboard",
    ],
  },

  PREMIUM: {
    title: "Pro",
    price: 30,
    queryLimit: 400, // per day
    description:
      "Advanced AI sales optimization for serious e-commerce operators.",
    features: [
      "Up to 400 AI actions per day",
      "Advanced product audits",
      "Founder-level strategic insights",
      "Unlimited proactive AI nudges",
      "Full store intelligence reports",
      "Priority support",
    ],
  },
};

export const GRACE_PERIOD_DAYS = 7;
