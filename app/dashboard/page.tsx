"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "@/components/dashboardExt/Sidebar";
import DashboardContent from "@/components/dashboardExt/DashboardContent";
import RenderActiveContent from "@/components/dashboardExt/RenderActiveContent";
import { useResizable } from "@/components/hooks/Resizable";
import AuthGuard from "@/components/hooks/AuthGuard";

const COLLAPSED_WIDTH = 65;
const DEFAULT_EXPANDED_WIDTH = 280;

const Page = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const lastExpandedWidth = useRef(DEFAULT_EXPANDED_WIDTH);

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
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
          width={sidebarWidth}
          onMouseDown={handleMouseDown}
        />
        <DashboardContent sidebarWidth={sidebarWidth}>
          <RenderActiveContent />
        </DashboardContent>
      </AuthGuard>
    </section>
  );
};

export default Page;
