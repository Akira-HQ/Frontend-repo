"use client";
import { ContextProps, Toast, User } from "@/types";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

const AppContext = createContext<ContextProps | undefined>(undefined);

const getLocalStorageItem = (key: string) => {
  if (typeof window !== "undefined") {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error parsing localstorage "${key}":`, error);
      localStorage.removeItem(key);
      return null;
    }
  }
  return null;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  // --- UI & UX State ---
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [initialLoadCompleteInternal, setInitialLoadCompleteInternal] = useState(false);
  const [getStarted, setGetStarted] = useState<boolean>(false);

  // --- Notification State ---
  const [alertMessage, setAlertMessageState] = useState<string>("");
  const [alertType, setAlertType] = useState<"success" | "error" | "loading" | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- Auth State ---
  const [user, setUserState] = useState<User | null>(null);

  // --- Cliva Chat State ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContextProduct, setChatContextProduct] = useState<any>(null);

  // --- Helper Functions ---
  const openChat = (product = null) => {
    setChatContextProduct(product);
    setIsChatOpen(true);
  };

  const addToast = (
    message: string,
    type: "success" | "error" | "loading" | "info" | "warning",
  ) => {
    setToasts((prevToasts) => {
      const updatedToasts = prevToasts.length >= 3 ? prevToasts.slice(1) : prevToasts;
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, message, type };
      return [...updatedToasts, newToast];
    });
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const setAlertMessage = (message: string, type?: "success" | "error" | "loading" | null) => {
    setAlertMessageState(message);
    setAlertType(type!);
    if (message && type !== "loading") {
      setTimeout(() => {
        setAlertMessageState("");
        setAlertType(null);
      }, 4000);
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = getLocalStorageItem("theme");
      const storedStarted = getLocalStorageItem("started");
      const storedUser = getLocalStorageItem("user");

      if (storedTheme !== null) setIsDarkMode(storedTheme);
      if (storedStarted !== null) setGetStarted(storedStarted);
      if (storedUser !== null) setUserState(storedUser);
      setInitialLoadCompleteInternal(true);
    }
  }, []);

  useEffect(() => {
    if (initialLoadCompleteInternal && typeof window !== "undefined") {
      localStorage.setItem("theme", JSON.stringify(isDarkMode));
      localStorage.setItem("started", JSON.stringify(getStarted));
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [isDarkMode, getStarted, user, initialLoadCompleteInternal]);

  const logout = () => {
    setUserState(null);
    setAlertMessageState("");
    setAlertType(null);
    setToasts([]);
    setIsChatOpen(false); // Close chat on logout

    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("started");
    }
    router.push("/register/sign-in");
  };

  const contextValue = React.useMemo(
    () => ({
      isDarkMode,
      alertMessage,
      alertType,
      user,
      setUser: setUserState,
      setIsDarkMode,
      initialLoadComplete: initialLoadCompleteInternal,
      setAlertMessage,
      setAlertType,
      getStarted,
      setGetStarted,
      toasts,
      addToast,
      removeToast,
      logout,
      // Chat Exports
      isChatOpen,
      setIsChatOpen,
      chatContextProduct,
      openChat
    }),
    [
      isDarkMode,
      alertMessage,
      alertType,
      getStarted,
      toasts,
      user,
      initialLoadCompleteInternal,
      isChatOpen,
      chatContextProduct
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppcontext must be used within a AppProvider");
  }
  return context;
};