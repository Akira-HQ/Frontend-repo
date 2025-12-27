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
import { ContextProps, Toast, User } from "@/types";

const AppContext = createContext<ContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // ================= UI / UX =================
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [initialLoadCompleteInternal, setInitialLoadCompleteInternal] =
    useState(false);
  const [getStarted, setGetStarted] = useState<boolean>(false);

  // ================= Notifications =================
  const [alertMessage, setAlertMessageState] = useState<string>("");
  const [alertType, setAlertType] = useState<
    "success" | "error" | "loading" | null
  >(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ================= Auth =================
  const [user, setUserState] = useState<User | null>(null);

  // ================= Chat =================
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContextProduct, setChatContextProduct] = useState<any>(null);

  // ================= WebSocket =================
  const socketRef = useRef<WebSocket | null>(null);
  const [wsEvent, setWsEvent] = useState<any>(null);

  // ================= Quota Sync =================
  /**
   * ⚡️ RECHARGE SYNC: 
   * Fetches the latest user data including quotas and batteries.
   * Hits the /me route which uses our robust mapper.
   */
  const syncQuotas = useCallback(async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const backendBase =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const res = await fetch(`${backendBase}/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        // json.user contains the fresh 'quotas' object from the backend mapper
        setUserState(json.user);
      } else if (res.status === 401) {
        logout();
      }
    } catch (err) {
      console.error("Quota sync failed:", err);
    }
  }, []);

  // ⚡️ Trigger sync immediately when a user is present to check for midnight recharge
  useEffect(() => {
    if (user?.id) {
      syncQuotas();
    }
  }, [user?.id]);

  // ================= Toast Helpers =================
  const addToast = (message: string, type: Toast["type"]) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ================= Alert Helper =================
  const setAlertMessage = (
    message: string,
    type: "success" | "error" | "loading" | null = null
  ) => {
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

  // ================= WebSocket Connection =================
  useEffect(() => {
    if (!user) return;

    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN ||
        socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let intentionalClose = false;

    const connect = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const wsBase =
        process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8001";

      ws = new WebSocket(
        `${wsBase.replace(/\/$/, "")}?token=${token}&type=dashboard`
      );

      socketRef.current = ws;
      let hasOpened = false;

      ws.onopen = () => {
        hasOpened = true;
        console.log("📡 Neural Link Established");
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          setWsEvent(payload);

          // ⚡️ REAL-TIME BATTERY DRAIN:
          // If the AI just finished a product or hit a limit, update the UI battery immediately
          if (payload.type === "AUDIT_PROGRESS" || payload.type === "AUDIT_COMPLETE") {
            syncQuotas();
          }
        } catch {
          // silently ignore malformed payloads
        }
      };

      ws.onclose = (e) => {
        socketRef.current = null;
        if (!hasOpened || intentionalClose) return;

        if (e.code === 1008 && process.env.NODE_ENV === "production") {
          logout();
          return;
        }

        reconnectTimer = setTimeout(connect, 5000);
      };

      ws.onerror = () => {
        ws?.close();
      };
    };

    connect();

    return () => {
      intentionalClose = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close(1000);
      }
      socketRef.current = null;
    };
  }, [user?.id, syncQuotas]);

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
    user,
    setUser: setUserState,
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
  if (!ctx) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return ctx;
};