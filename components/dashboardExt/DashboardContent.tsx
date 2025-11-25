'use client'
import React, { ReactNode } from 'react'
import { useAppContext } from '../AppContext';

interface DashboardContentProps {
  children: React.ReactNode;
  sidebarWidth: number
}

const DashboardContent = ({ children, sidebarWidth }: DashboardContentProps) => {
  const { isDarkMode } = useAppContext()
  return (
    <div className={`flex-1 p-8 pt-3 transition-all duration-300 ease-in-out rounded-md shadow-md bg-[#060606] `}
      style={{ marginLeft: `${sidebarWidth}px` }}
    >
      {children}
    </div>
  )
}

export default DashboardContent
