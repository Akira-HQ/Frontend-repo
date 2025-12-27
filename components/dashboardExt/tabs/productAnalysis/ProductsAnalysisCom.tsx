"use client";
import React, { useEffect, useState, useCallback } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi2";
import ProductTable from "./ProductTable";
import ProductAudit from "./ProductAudit";
import ProductTableSkeleton from "./ProductTableSkeleton";
import { UseAPI } from "@/components/hooks/UseAPI";
import { useAppContext } from "@/components/AppContext";

const ProductsAnalysisCom = () => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analyzedProducts, setAnalyzedProducts] = useState<any[]>([]);
  const [isBgAnalyzing, setIsBgAnalyzing] = useState(false);

  // Destructure 'user' from context to fix "Cannot find name 'user'" errors
  const { callApi } = UseAPI();
  const { syncQuotas, user } = useAppContext(); // ⚡️ ADDED 'user' HERE

  const fetchProducts = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await callApi("/products/analyze");
      if (response?.data) {
        const products = response.data.analyzedProducts;
        const quotas = response.data.quotas;

        setAnalyzedProducts(products);

        // ⚡️ TIGHT LOGIC FIX:
        // We are only "Analyzing" if:
        // 1. There are products not yet AI audited
        // 2. AND we haven't hit our daily energy limit (audits_used < audits_limit)
        const hasPending = products.some((p: any) => !p.is_ai_audited);
        const hasEnergy = quotas.audits_used < quotas.audits_limit;

        setIsBgAnalyzing(hasPending && hasEnergy);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [callApi]);

  // Define handleProductUpdated to fix "Cannot find name 'handleProductUpdated'" error
  const handleProductUpdated = (updated: any) => {
    setAnalyzedProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedProduct(updated);
  };

  // Real-time Neural Link
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) return;

      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}&type=dashboard`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Refresh UI when a product is analyzed or process finishes
        if (data.type === "AUDIT_PROGRESS" || data.type === "AUDIT_COMPLETE") {
          fetchProducts(true); // Update table scores
          syncQuotas();        // Drain Energy Bars in real-time
        }
      };

      return () => ws.close();
    }
  }, [fetchProducts, syncQuotas]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="mt-20 px-6 max-w-[1600px] mx-auto pb-20">
      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex justify-between items-end mb-6 px-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Live Inventory</h2>
            {isBgAnalyzing && (
              <div className="flex items-center gap-2 px-3 py-1 bg-[#A500FF]/10 border border-[#A500FF]/20 rounded-full animate-pulse">
                <span className="text-[10px] font-bold text-[#A500FF] uppercase tracking-widest">AI Auditing Active</span>
              </div>
            )}
          </div>
          {isLoading ? <ProductTableSkeleton /> :
            <ProductTable products={analyzedProducts} selectedProduct={selectedProduct} onSelectedProduct={setSelectedProduct} />
          }
        </div>
        <div className="col-span-12 lg:col-span-4 sticky top-24">
          <ProductAudit
            product={selectedProduct}
            onSelect={setSelectedProduct}
            onProductUpdated={handleProductUpdated} // Fixed
            isBgAnalyzing={isBgAnalyzing}
            // Logic for Quota calculation using destructured 'user'
            enhanceQuota={user?.quotas ? user.quotas.enhance_limit - user.quotas.enhance_used : 0}
            setEnhanceQuota={syncQuotas}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsAnalysisCom;