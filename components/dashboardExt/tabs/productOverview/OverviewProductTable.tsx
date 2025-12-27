"use client";
import React from "react";

const OverviewProductTable = ({ products, selectedProduct, onSelectedProduct }: any) => {
  if (!products || products.length === 0) {
    return (
      <div className="p-8 bg-[#0f1117] rounded-lg text-center text-gray-500">
        No products found. Please connect your store or wait for sync.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-12 gap-4 px-4 text-xs font-semibold text-gray-400 border-b border-gray-700 pb-2">
        <div className="col-span-4">PRODUCT (Name / SKU)</div>
        <div className="col-span-2 text-right">PRICE</div>
        <div className="col-span-2 text-center">STOCK</div>
        <div className="col-span-2 text-center">STATUS</div>
        <div className="col-span-2 text-right">HEALTH</div>
      </div>

      {products?.map((product: any) => {
        const isSelected = selectedProduct?.id === product.id;
        const healthScore = product.health_score || product.health || 0;
        const statusLabel = product.analysis?.status_label || product.status || "Weak";

        return (
          <div
            key={product.id}
            onClick={() => onSelectedProduct(product)}
            className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg bg-[#0f1117] cursor-pointer transition-all duration-200 hover:scale-[1.01] ${isSelected ? "ring-2 ring-[#A500FF]" : "border border-transparent"}`}
          >
            <div className="col-span-4 flex flex-col justify-center">
              <span className="font-medium text-white truncate">{product.name}</span>
              <span className="text-xs text-gray-500 font-mono">SKU: {product.sku}</span>
            </div>

            <div className="col-span-2 text-right font-medium text-white">
              {product.price > 0 ? `$${parseFloat(product.price).toFixed(2)}` : "N/A"}
            </div>

            <div className="col-span-2 text-center">
              <span className={`text-sm font-semibold ${product.stock <= 0 ? "text-red-400" : "text-green-400"}`}>
                {product.stock <= 0 ? "OOS" : product.stock}
              </span>
            </div>

            <div className="col-span-2 text-center">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusLabel === "Strong" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                {statusLabel}
              </span>
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full ${healthScore > 65 ? "bg-[#A500FF]" : "bg-[#FFB300]"}`} style={{ width: `${healthScore}%` }}></div>
              </div>
              <span className="text-sm text-gray-300">{healthScore}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewProductTable;