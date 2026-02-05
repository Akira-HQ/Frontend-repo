"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { ContextProps, Toast, User, Notification } from "@/types";

const AppContext = createContext<ContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // ================= UI / UX =================
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [initialLoadCompleteInternal, setInitialLoadCompleteInternal] = useState(false);
  const [getStarted, setGetStarted] = useState<boolean>(false);

  // ================= Notifications =================
  const [alertMessage, setAlertMessageState] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error" | "loading" | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ⚡️ SOURCE OF TRUTH: Global notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ================= Auth =================
  const [user, setUserState] = useState<User | null>(null);

  // ================= Chat =================
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContextProduct, setChatContextProduct] = useState<any>(null);

  // ================= WebSocket =================
  const socketRef = useRef<WebSocket | null>(null);
  const [wsEvent, setWsEvent] = useState<any>(null);

  const backendBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // ================= Core Sync Logic =================
  const syncQuotas = useCallback(async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${backendBase}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const json = await res.json();

        // ⚡️ ENSURE ATOMIC UPDATE: Set both user and notifications together
        setUserState(json.user);

        // Handle cases where notifications might be returned as stringified JSONB
        const rawNotifs = json.user.notifications;
        const parsedNotifs = typeof rawNotifs === 'string' ? JSON.parse(rawNotifs) : (rawNotifs || []);
        setNotifications(parsedNotifs);

      } else if (res.status === 401) {
        logout();
      }
    } catch (err) {
      console.error("Critical sync failed:", err);
    }
  }, [backendBase]);

  // ⚡️ BOOTSTRAP: Initial sync on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      syncQuotas();
    }
    setInitialLoadCompleteInternal(true);
  }, [syncQuotas]);

  // ================= Persistent Notification Actions =================

  const markNotificationRead = async (id: string) => {
    // 1. Optimistic Update (UI feels instant)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    const token = localStorage.getItem("token");
    try {
      await fetch(`${backendBase}/notifications/mark-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId: id }),
      });
      // Optionally re-sync to ensure the count is exactly right
      // syncQuotas(); 
    } catch (err) {
      console.error("Backend read sync failed");
    }
  };

  const clearNotification = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const token = localStorage.getItem("token");
    try {
      await fetch(`${backendBase}/notifications/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ notificationId: id }),
      });
    } catch (err) {
      console.error("Backend delete sync failed");
    }
  };

  // ================= WebSocket Connection =================
  useEffect(() => {
    if (!user) return;
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let intentionalClose = false;

    const connect = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const wsBase = process.env.NEXT_PUBLIC_WS_URL || "wss://localhost:8001";
      ws = new WebSocket(`${wsBase.replace(/\/$/, "")}?token=${token}&type=dashboard`);
      socketRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          setWsEvent(payload);

          if (payload.type === "AUDIT_COMPLETE" || payload.type === "QUOTA_UPDATE") {
            syncQuotas();
          }

          if (payload.type === "PUSH_NOTIFICATION") {
            setNotifications(prev => [payload.notification, ...prev]);
            addToast("Intelligence Briefing Received", "success");
          }
        } catch { /* ignore malformed */ }
      };

      ws.onclose = () => {
        socketRef.current = null;
        if (intentionalClose) return;
        reconnectTimer = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      intentionalClose = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) ws.close(1000);
      socketRef.current = null;
    };
  }, [user?.id, syncQuotas]);

  // ================= Toast & Alert Helpers =================
  const addToast = (message: string, type: Toast["type"]) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setAlertMessage = (message: string, type: "success" | "error" | "loading" | null = null) => {
    setAlertMessageState(message);
    setAlertType(type);
    if (message && type !== "loading") {
      setTimeout(() => {
        setAlertMessageState("");
        setAlertType(null);
      }, 4000);
    }
  };

  // ================= Auth =================
  const logout = () => {
    setUserState(null);
    setNotifications([]);
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    router.push("/register/sign-in");
  };

  // ================= Chat Helpers =================
  const openChat = (product: any = null) => {
    setChatContextProduct(product);
    setIsChatOpen(true);
  };

  // ================= Context Value =================
  const contextValue: ContextProps = {
    isDarkMode,
    setIsDarkMode,
    initialLoadComplete: initialLoadCompleteInternal,
    getStarted,
    setGetStarted,
    alertMessage,
    setAlertMessage,
    alertType,
    toasts,
    addToast,
    removeToast,
    // ⚡️ Crucial: Merge live notifications into the user object for child components
    user: user ? { ...user, notifications } : null,
    setUser: setUserState,
    notifications,
    setNotifications,
    markNotificationRead,
    clearNotification,
    logout,
    isChatOpen,
    setIsChatOpen,
    chatContextProduct,
    openChat,
    wsEvent,
    syncQuotas,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};