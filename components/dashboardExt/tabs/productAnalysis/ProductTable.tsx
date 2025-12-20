"use client";
import React from "react";
import { Product } from "./ProductsAnalysisCom";
import { IoChatbubblesOutline, IoCubeOutline } from "react-icons/io5";
import { useAppContext } from "../../../AppContext";
import { Sparkles } from "lucide-react";

interface ProductTableProps {
  products: Product[] | null;
  selectedProduct: Product | null;
  onSelectedProduct: (product: Product | null) => void;
}

const ProductTable = ({
  products,
  selectedProduct,
  onSelectedProduct,
}: ProductTableProps) => {
  const { openChat } = useAppContext();

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
        <div className="col-span-5">Product Entity</div>
        <div className="col-span-2 text-center">AI Status</div>
        <div className="col-span-3 text-center">Health Score</div>
        <div className="col-span-2 text-right px-4">Actions</div>
      </div>

      {products?.map((product) => (
        <div
          key={product.id}
          onClick={() => onSelectedProduct(product)}
          className={`grid grid-cols-12 gap-4 items-center p-4 rounded-[2rem] bg-[#0b0b0b] border transition-all duration-500 cursor-pointer group
            ${selectedProduct?.id === product.id
              ? "border-amber-500/40 bg-amber-500/[0.03] shadow-[0_0_40px_rgba(245,158,11,0.05)]"
              : "border-white/5 hover:border-white/10 hover:bg-white/[0.02]"}`}
        >
          {/* Product Info */}
          <div className="col-span-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-900 overflow-hidden border border-white/5 shrink-0 shadow-2xl relative">
              {product.imageUrls?.[0] ? (
                <img src={product.imageUrls[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-700 font-bold uppercase">No Img</div>
              )}
            </div>
            <div className="flex flex-col truncate">
              <span className="font-bold text-white tracking-tight group-hover:text-amber-200 transition-colors truncate">{product.name}</span>
              <div className="flex items-center gap-1.5">
                <IoCubeOutline className={product.stock <= 0 ? "text-red-500" : "text-gray-500"} size={12} />
                <span className={`text-[10px] font-mono ${product.stock <= 0 ? "text-red-500 font-black" : "text-gray-500"}`}>
                  {product.stock <= 0 ? "OUT OF STOCK" : `STOCK: ${product.stock}`}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="col-span-2 flex flex-col items-center gap-2">
            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border 
    ${product.status === "Strong" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`}>
              {product.status}
            </span>

            {product.is_ai_audit ? (
              <div className="flex items-center gap-1 px-2 py-0.5  rounded-md">
                <Sparkles size={10} className="text-indigo-400 animate-pulse" />
                <span className="text-[8px] text-indigo-400 font-bold uppercase">Deep Audit</span>
              </div>
            ) : (
              <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Standard Check</span>
            )}
          </div>

          {/* Health Bar */}
          <div className="col-span-3 flex items-center justify-center gap-4">
            <div className="hidden md:block w-24 bg-white/5 rounded-full h-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${product.health > 65 ? "bg-green-500" : "bg-amber-500"}`}
                style={{ width: `${product.health}%` }}
              ></div>
            </div>
            <span className="text-sm font-mono font-bold text-gray-400 group-hover:text-white transition-colors">{product.health}</span>
          </div>

          {/* Actions / Chat Icon */}
          <div className="col-span-2 flex justify-end px-2">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevents selecting the row
                openChat(product);
              }}
              className="p-3 bg-amber-500/50 text-amber-500 rounded-2xl border border-amber-500/20 
                opacity-20 group-hover:opacity-100 transition-all duration-300 hover:bg-amber-500/20 
                active:scale-90 shadow-lg shadow-amber-500/5"
              title="Discuss with Cliva"
            >
              <IoChatbubblesOutline size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductTable;