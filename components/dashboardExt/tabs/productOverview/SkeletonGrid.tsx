"use client";
import React from "react";

const SkeletonCard = () => (
  <div className="bg-[#0f1117] rounded-xl overflow-hidden shadow-xl border border-gray-800 animate-pulse flex flex-col">
    {/* Image Placeholder (h-40 matches the real card height) */}
    <div className="h-40 bg-gray-800 relative">
      {/* Price/Health Tag Placeholder */}
      <div className="absolute top-3 right-3 h-6 w-16 rounded-full bg-gray-700"></div>
    </div>

    {/* Content Placeholder */}
    <div className="p-4 space-y-3">
      {/* Product Name Placeholder */}
      <div className="h-5 w-3/4 rounded bg-gray-700"></div>

      {/* SKU and Price Placeholder */}
      <div className="flex justify-between items-center text-sm">
        <div className="h-3 w-1/4 rounded bg-gray-800"></div>
        <div className="h-4 w-1/6 rounded bg-gray-700"></div>
      </div>

      {/* Separator Line */}
      <div className="h-px w-full bg-gray-800"></div>

      {/* Stock Status Placeholder */}
      <div className="flex justify-between items-center">
        <div className="h-4 w-1/3 rounded-full bg-gray-800"></div>
        <div className="h-4 w-1/5 rounded-full bg-gray-800"></div>
      </div>
    </div>
  </div>
);

const SkeletonGrid = () => {
  return (
    <div className="mt-8">
      {/* Section Title Placeholder */}
      <div className="h-6 w-64 rounded bg-gray-800 mb-4 animate-pulse"></div>

      {/* Grid of Skeleton Cards (5 items mirrored from mock API) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(5)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
};

export default SkeletonGrid;
