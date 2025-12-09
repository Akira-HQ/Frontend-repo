"use client";
import React from "react";

const ProductTableSkeleton = () => {
  const SkeletonRow = () => (
    <div className="grid grid-col-12 gap-4 items-center p-4 rounded-lg shadow-md bg-[#1A1D22]">
      <div className="col-span-5 flex items-center gap-4">
        <div className="h-10 w-10 rounded-md bg-gray-700"></div>
        <div className="h-4 w-3/4 rounded bg-gray-700"></div>
      </div>

      <div className="col-span-3">
        <div className="h-6 w-16 rounded-full bg-gray-700"></div>
      </div>

      <div className="col-span-4">
        <div className="h-4 w-full rounded bg-gray-700"></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="grid grid-cols-12 gap-4 px-4">
        <div className="col-span-5 h-4 w-1/4 rounded bg-gray-700"></div>
        <div className="col-span-3 h-4 w-1/2 rounded bg-gray-700"></div>
        <div className="col-span-4 h-4 w-1/2 rounded bg-gray-700"></div>
      </div>

      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  );
};

export default ProductTableSkeleton;
