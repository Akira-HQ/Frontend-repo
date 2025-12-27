"use client";
import React from "react";
import { IoChatbubblesOutline, IoCubeOutline } from "react-icons/io5";
import { useAppContext } from "../../../AppContext";
import { Sparkles } from "lucide-react";
import { Product } from "@/types";

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
        <div className="col-span-2 text-center">Intelligence Status</div>
        <div className="col-span-3 text-center">Health Score</div>
        <div className="col-span-2 text-right px-4">Actions</div>
      </div>

      {products?.map((product) => {
        const isDeepAudited = product.is_ai_audited === true;
        const score = Number(product.health_score) || 0;

        // ⚡️ Clean Logic: Only Strong or Weak. No "Analyzing" noise.
        const displayStatus = score > 65 ? "Strong" : "Weak";

        return (
          <div
            key={product.id}
            onClick={() => onSelectedProduct(product)}
            className={`grid grid-cols-12 gap-4 items-center p-4 rounded-[2rem] bg-[#0b0b0b] border transition-all duration-500 cursor-pointer group
              ${selectedProduct?.id === product.id
                ? "border-amber-500/40 bg-amber-500/[0.03] shadow-[0_0_40px_rgba(245,158,11,0.05)]"
                : "border-white/5 hover:border-white/10 hover:bg-white/[0.02]"}`}
          >
            {/* 1. Product Info */}
            <div className="col-span-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 overflow-hidden border border-white/5 shrink-0 shadow-2xl relative">
                {product.image_url ? (
                  <img
                    src={Array.isArray(product.image_url) ? product.image_url[0] : product.image_url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt=""
                  />
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

            {/* 2. Intelligence Status (The result-only view) */}
            <div className="col-span-2 flex flex-col items-center gap-2">
              <span className={`px-4 py-1 text-[10px] font-black uppercase rounded-full border transition-all duration-500
                ${displayStatus === "Strong"
                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`}>
                {displayStatus}
              </span>

              {/* Logic Badge: Stealth mode. No "Queue" mentioned. */}
              {isDeepAudited ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/10">
                  <Sparkles size={10} className="text-indigo-400 animate-pulse" />
                  <span className="text-[7px] text-indigo-400 font-black uppercase tracking-tighter">Deep Logic</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                  <span className="text-[7px] text-gray-500 font-black uppercase tracking-tighter">
                    Standard Logic
                  </span>
                </div>
              )}
            </div>

            {/* 3. Health Bar */}
            <div className="col-span-3 flex items-center justify-center gap-4">
              <div className="hidden md:block w-24 bg-white/5 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${score > 65 ? "bg-green-500" : "bg-amber-500"}`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
              <span className="text-sm font-mono font-bold text-gray-400 group-hover:text-white transition-colors">
                {score}%
              </span>
            </div>

            {/* 4. Actions */}
            <div className="col-span-2 flex justify-end px-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openChat(product);
                }}
                className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 
                  opacity-20 group-hover:opacity-100 transition-all duration-300 hover:bg-amber-500/20 
                  active:scale-95 shadow-xl"
              >
                <IoChatbubblesOutline size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductTable;