import { ReactNode, createContext, useContext } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "loading" | "warning";
}

// User Types
export interface User {
  id: string | number;
  name: string;
  email: string;
  password: string;
  plan: string;
  store?: {
    storeName: string;
    storeUrl: string;
    storeId: string;
    snippetToken: string;
    platform: string;
  };
  onboardingStep: "CONNECT_STORE" | "PAYMENT_WALL" | "COMPLETED";
  daily_audit_limit?: number;
  daily_enhance_limit?: number;
  daily_chat_limit?: number;
}

export interface ContextProps {
  isDarkMode: boolean;
  setIsDarkMode: (theme: boolean) => void;
  alertMessage: string;
  setAlertMessage: (
    message: string,
    type?: "success" | "error" | "loading" | null,
  ) => void;
  alertType: "success" | "error" | "loading" | null;
  setAlertType: (type: "success" | "error" | "loading" | null) => void;
  initialLoadComplete: boolean;
  getStarted: boolean;
  setGetStarted: (start: boolean) => void;
  toasts: Toast[];
  addToast: (
    message: string,
    type: "success" | "error" | "info" | "loading" | "warning",
  ) => void;
  removeToast: (id: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatContextProduct: any; // or a specific Product type if you have one
  openChat: (product?: any) => void;
  syncQuotas: () => Promise<void>;
}

// PageTracker Types
export interface PageData {
  page: string;
  entryTime: string;
  duration: number;
}

export interface PageHistory {
  page: string;
  entryTime: string;
  duration: number;
  exitTime?: string;
}

// Button Types
export interface ButtonProps {
  children: string | ReactNode;
  onClick?: () => void;
  type?: "submit" | "button";
  className?: string;
  isDarkMode?: boolean;
  disabled?: boolean | string;
}

// Resizable Types
export interface UseResizableProps {
  initialWidth: number;
  minWidth?: number;
  maxWidth?: number;
}

//Dashboard Types
interface DashboardProps {
  children: ReactNode;
  collasped?: boolean;
}

export interface UsageAlertData {
  title: string;
  message: string;
  progress: {
    value: number; // Changed to number for math (e.g., 4)
    max: number;   // The plan limit (e.g., 5, 50, or 500)
    unit: string;  // e.g., "Audits" or "Enhancements"
    percentage?: number; // Optional: can be pre-calculated
  };
}

export type NotificationType = "USAGE_ALERT" | "ANNOUNCEMENT" | "SECURITY_TIP" | "SYNC_STATUS";

export interface Notification {
  id: string;
  type: NotificationType;
  read: boolean;
  timestamp: Date;
  data: UsageAlertData; // Or a Union type if other types have different data structures
}

export interface AnnoucementData {
  title: string;
  message: string;
  icon: string;
}

export interface SecurityTipData {
  title: string;
  message: string;
  action: {
    text: string;
    link: string;
  };
}

// export type Notification = {
//   id: string;
//   timestamp: string;
//   read: boolean;
// } & (
//   | { type: "USAGE_ALERT"; data: UsageAlertData }
//   | { type: "ANNOUNCEMENT"; data: AnnoucementData }
//   | { type: "SECURITY_TIP"; data: SecurityTipData }
// );

export type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined)
    return { isDarkMode: true, toggleDarkMode: () => {} };
  return context;
};

export const BASE_BG = "bg-[#050505]";
export const NEON_GRADIENT = "bg-gradient-to-r from-[#00A7FF] to-[#A500FF]";
export const ACCENT_COLOR_BLUE = "#00A7FF";
export const ACCENT_COLOR_PURPLE = "#A500FF";
export const CARD_BG = "bg-gray-900/50";
// --- STYLING CONSTANTS ---
export const NEON_PURPLE = "#A500FF";
export const NEON_ORANGE = "#FFB300";
export const ACCENT_BLUE = "#00A7FF";
export const TEXT_GRAY = "#9ca3af"; // gray-400
export const CHART_GRID_COLOR = "#374151"; // gray-700

export type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrls: string[] | null;
  status: "Strong" | "Weak";
  health: number;
  stock: number;
  price: number;
  sku?: string;
};

// Shared Metrics Type
export type Metric = {
  label: string;
  value: string;
  trend: 1 | 0 | -1; // 1: up, 0: neutral, -1: down
};

// Shared Report Data Type
export type ReportData = {
  id: string;
  type: "DIGEST" | "ALERT" | "ESCALATION" | "QUERY_RESPONSE";
  title: string;
  message: string;
  time: string;
  conversationId?: string;
};

// Mock KPI Data
export const MOCK_KPIS: Metric[] = [
  { label: "Conversion Rate Lift", value: "+7.1%", trend: 1 },
  { label: "Average Order Value", value: "$134", trend: 0 },
  { label: "Response Time (Avg)", value: "0.8s", trend: -1 },
  { label: "Abandoned Cart Recovery", value: "12%", trend: 1 },
];

// Mock Reports
export const MOCK_REPORTS: ReportData[] = [
  {
    id: "r_003",
    type: "ALERT",
    title: "Hottest Product Alert!",
    message:
      "The **Pro DSLR Camera MK-V** saw a 25% increase in purchase intent after Akira recommended it 45 times yesterday. Consider boosting ad spend.",
    time: "1 hour ago",
    conversationId: "conv_789",
  },
  {
    id: "r_002",
    type: "DIGEST",
    title: "Daily Sales Digest: 12/05/2025",
    message:
      "Total conversions increased by 7% thanks to automated follow-ups. However, the **Smartwatch Series 8** hit 0 stock, generating 12 frustrated customer chats.",
    time: "5 hours ago",
  },
  {
    id: "r_001",
    type: "ESCALATION",
    title: "Human Intervention Required",
    message:
      "A customer is demanding a refund outside the 30-day window for order #3098. Please review the chat log and handle the exception.",
    time: "1 day ago",
    conversationId: "conv_101",
  },
];
