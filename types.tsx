import { ReactNode } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | 'error' | 'info'
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
  }
}

export interface ContextProps {
  isDarkMode: boolean;
  setIsDarkMode: (theme: boolean) => void;
  alertMessage: string;
  setAlertMessage: (message: string, type?: 'success' | 'error' | "loading" | null) => void;
  alertType: 'success' | "error" | "loading" | null;
  setAlertType: (type: "success" | "error" | "loading" | null) => void;
  initialLoadComplete: boolean;
  getStarted: boolean;
  setGetStarted: (start: boolean) => void;
  toasts: Toast[];
  addToast: (message: string, type: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  user: User | null;
  setUser: (user: User | null) => void
  logout: () => void
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
  type?: "submit" | "button"
  className?: string
  isDarkMode?: boolean
  disabled?: boolean | string
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

//Notification Types
export interface UsageAlertData {
  title: string;
  message: string;
  progress: {
    value: number;
    max: number;
    unit: string;
  };
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
  }
}

export type Notification = {
  id: string;
  timestamp: string;
  read: boolean;
} & (
    | { type: "USAGE_ALERT"; data: UsageAlertData }
    | { type: "ANNOUNCEMENT"; data: AnnoucementData }
    | { type: "SECURITY_TIP"; data: SecurityTipData }
  )