"use client";
import React from "react";

export const DashboardSkeleton = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white relative z-10">
      {/* 1. HEADER SKELETON */}
      <div className="mb-12 space-y-4">
        <div className="h-10 w-72 bg-white/10 rounded-2xl animate-pulse" />
        <div className="h-3 w-48 bg-white/5 rounded-full animate-pulse" />
      </div>

      {/* 2. STAT CARDS / BATTERY SKELETON */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-52 p-8 rounded-[2.5rem] bg-black border border-white/5 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-white/10 rounded-2xl animate-pulse" />
              <div className="w-8 h-4 bg-white/10 rounded-full animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-5 w-3/4 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-2 w-full bg-white/5 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. MAIN CONTENT / GRAPH AREA SKELETON */}
      <div className="bg-[#080808] rounded-[3rem] border border-white/5 p-10 h-[400px] flex flex-col justify-between">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-6 w-56 bg-white/10 rounded-lg animate-pulse" />
          </div>
          <div className="h-8 w-32 bg-white/5 rounded-xl animate-pulse" />
        </div>

        {/* Mock Chart Lines */}
        <div className="flex-1 flex items-end gap-3 px-4 pb-4">
          {[60, 40, 90, 70, 50, 80, 100, 60, 40, 80].map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="flex-1 bg-white/5 rounded-t-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;