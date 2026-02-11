export const PLAN_CONFIG = {
  FREE: {
    title: "Free",
    price: 0,
    queryLimit: 1000,
    description: "Try Cliva risk-free and see how AI sales assistance feels.",
    features: [
      "7-day free trial access",
      "Up to 1,000 AI actions",
      "Live customer chat (limited)",
      "Basic session analytics",
      "Shopify store integration",
    ],
  },

  BASIC: {
    title: "Basic",
    price: 10,
    queryLimit: 10000,
    description: "For growing stores that want AI-powered sales support.",
    features: [
      "Up to 5,000 customer sessions / month",
      "10,000 AI actions",
      "Smart product recommendations",
      "Proactive AI greetings",
      "Sales & conversion analytics",
      "Email support",
    ],
  },

  PREMIUM: {
    title: "Pro",
    price: 20,
    queryLimit: 50000,
    description: "Advanced AI intelligence for serious e-commerce growth.",
    features: [
      "Up to 15,000 customer sessions / month",
      "50,000 AI actions",
      "Unlimited proactive AI nudges",
      "Product audits & optimization insights",
      "Strategic AI commands (founder-level insights)",
      "Priority support",
    ],
  },
};

export const GRACE_PERIOD_DAYS = 7;
