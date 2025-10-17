'use client'
import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '@/components/dashboardExt/Sidebar'
import DashboardContent from '@/components/dashboardExt/DashboardContent'
import RenderActiveContent from '@/components/dashboardExt/RenderActiveContent'
import { useResizable } from '@/components/hooks/Resizable'

const COLLAPSED_WIDTH = 65;
const DEFAULT_EXPANDED_WIDTH = 280;

const Page = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
  const lastExpandedWidth = useRef(DEFAULT_EXPANDED_WIDTH);

  const {
    width: sidebarWidth,
    setWidth: setSidebarWidth, 
    isResizing,
    handleMouseDown
  } = useResizable({
    initialWidth: DEFAULT_EXPANDED_WIDTH,
    minWidth: 260,
    maxWidth: 300
  })

  // This effect updates our ref whenever the user finishes resizing
  useEffect(() => {
    if (!isSidebarCollapsed && !isResizing) {
      lastExpandedWidth.current = sidebarWidth;
    }
  }, [sidebarWidth, isSidebarCollapsed, isResizing]);

  // This is the new, synchronized toggle function
  const toggleSidebar = () => {
    const newCollapsedState = !isSidebarCollapsed;
    setSidebarCollapsed(newCollapsedState);

    if (newCollapsedState) {
      // If we are COLLAPSING, force the width to the fixed collapsed value
      setSidebarWidth(COLLAPSED_WIDTH);
    } else {
      // If we are EXPANDING, restore the last known width from our ref
      setSidebarWidth(lastExpandedWidth.current);
    }
  }

  // Your window resize listener, now also controls the width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
        setSidebarWidth(COLLAPSED_WIDTH) // Crucially, also set the width
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, []) // Empty dependency array is correct here

  return (
    <section className={`pt-10 main-bg h-screen w-screen relative ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        width={sidebarWidth}
        onMouseDown={handleMouseDown}
      />
      <DashboardContent sidebarWidth={sidebarWidth} >
        <RenderActiveContent />
      </DashboardContent>
    </section>
  )
}

export default Page