"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "@/components/dashboardExt/Sidebar";
import DashboardContent from "@/components/dashboardExt/DashboardContent";
import RenderActiveContent from "@/components/dashboardExt/RenderActiveContent";
import { useResizable } from "@/components/hooks/Resizable";
import AuthGuard from "@/components/hooks/AuthGuard";
import { ClivaStarsBackground } from "@/components/Stars";
import { useAppContext } from "@/components/AppContext";
import { IoChatbubbleOutline } from "react-icons/io5";
import ClivaChat from "@/components/chatTools/ClivaChat";

const COLLAPSED_WIDTH = 65;
const DEFAULT_EXPANDED_WIDTH = 280;

const Page = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const lastExpandedWidth = useRef(DEFAULT_EXPANDED_WIDTH);
  const {isChatOpen, openChat, setIsChatOpen, chatContextProduct} = useAppContext()

  const {
    width: sidebarWidth,
    setWidth: setSidebarWidth,
    isResizing,
    handleMouseDown,
  } = useResizable({
    initialWidth: DEFAULT_EXPANDED_WIDTH,
    minWidth: 260,
    maxWidth: 300,
  });

  useEffect(() => {
    if (!isSidebarCollapsed && !isResizing) {
      lastExpandedWidth.current = sidebarWidth;
    }
  }, [sidebarWidth, isSidebarCollapsed, isResizing]);

  const toggleSidebar = () => {
    const newCollapsedState = !isSidebarCollapsed;
    setSidebarCollapsed(newCollapsedState);

    if (newCollapsedState) {
      setSidebarWidth(COLLAPSED_WIDTH);
    } else {
      setSidebarWidth(lastExpandedWidth.current);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
        setSidebarWidth(COLLAPSED_WIDTH);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <section
      className={`pt-10 main-bg h-screen w-screen relative ${isResizing ? "cursor-col-resize select-none" : ""}`}
    >
      <AuthGuard>
        <ClivaStarsBackground density={200} />
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
          width={sidebarWidth}
          onMouseDown={handleMouseDown}
        />
        <DashboardContent sidebarWidth={sidebarWidth}>
          <RenderActiveContent />
          {/* FLOATING GLOBAL CHAT TRIGGER */}
          {!isChatOpen && (
            <button
              onClick={() => openChat(null)}
              className="fixed bottom-10 right-10 z-50 p-4 bg-amber-500 text-black rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-110 transition-all active:scale-95 group"
            >
              <IoChatbubbleOutline size={28} />
              <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#0b0b0b] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Ask Cliva
              </span>
            </button>
          )}
          <ClivaChat
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            activeProduct={chatContextProduct}
          />
        </DashboardContent>
      </AuthGuard>
    </section>
  );
};

export default Page;
