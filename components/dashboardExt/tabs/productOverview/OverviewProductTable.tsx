"use client";
import React from "react";

// Note: Reusing the existing Product type definition from ProductsOverview.tsx
type AuditCheck = {
  id: string;
  met: boolean;
  text: string;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrls: string[] | null; // <-- CORRECT (array of strings)
  status: "Strong" | "Weak";
  health: number;
  reasons: string[];
  auditChecklist: AuditCheck[];
  stock: number;
  price: number;
  // Assuming a SKU field or similar identifier for 'other details'
  sku?: string;
};

interface ProductTableProps {
  products: Product[] | null;
  selectedProduct: Product | null;
  onSelectedProduct: (product: Product | null) => void;
}

const OverviewProductTable = ({
  products,
  selectedProduct,
  onSelectedProduct,
}: ProductTableProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="p-8 bg-[#0f1117] rounded-lg text-center text-gray-500">
        No products found. Please connect your store or wait for the initial
        sync.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Table Header: Defined column widths for responsiveness */}
      <div className="grid grid-cols-12 gap-4 px-4 text-xs font-semibold text-gray-400 border-b border-gray-700 pb-2">
        <div className="col-span-4">PRODUCT (Name / SKU)</div>
        <div className="col-span-2 text-right">PRICE</div>
        <div className="col-span-2 text-center">STOCK</div>
        <div className="col-span-2 text-center">STATUS</div>
        <div className="col-span-2 text-right">HEALTH</div>
      </div>

      {products?.map((product) => {
        const isSelected = selectedProduct?.id === product.id;
        const stockLevel = product.stock;

        let stockColor = "text-green-400";
        if (stockLevel === 0) stockColor = "text-red-400";
        else if (stockLevel < 10) stockColor = "text-yellow-400";

        return (
          <div
            key={product.id}
            onClick={() => onSelectedProduct(product)}
            className={`
              grid grid-cols-12 gap-4 items-center p-3 rounded-lg 
              bg-[#0f1117] shadow-lg cursor-pointer 
              transition-all duration-200 
              hover:shadow-purple-900/40 hover:scale-[1.01]
              ${
                isSelected
                  ? "ring-2 ring-offset-2 ring-offset-[#0f1117] ring-[#A500FF] border border-[#A500FF]/50"
                  : "border border-transparent"
              }
            `}
          >
            {/* 1. Product Name / SKU */}
            <div className="col-span-4 flex flex-col justify-center">
              <span className="font-medium text-white truncate">
                {product.name}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                SKU: {product.sku || product.id.substring(0, 8)}
              </span>
            </div>

            {/* 2. Price */}
            <div className="col-span-2 text-right font-medium text-white">
              {product.price > 0 ? `${product.price.toFixed(2)}` : "N/A"}
            </div>

            {/* 3. Stock */}
            <div className="col-span-2 text-center">
              <span className={`text-sm font-semibold ${stockColor}`}>
                {stockLevel === 0 ? "OOS" : stockLevel}
              </span>
            </div>

            {/* 4. Status Badge */}
            <div className="col-span-2 text-center">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full 
                ${
                  product.status === "Strong"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {product.status}
              </span>
            </div>

            {/* 5. Health Bar (Health) */}
            <div className="col-span-2 flex items-center gap-2">
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${product.health > 65 ? "bg-[#A500FF]" : "bg-[#FFB300]"}`}
                  style={{ width: `${product.health}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-300">{product.health}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OverviewProductTable;
