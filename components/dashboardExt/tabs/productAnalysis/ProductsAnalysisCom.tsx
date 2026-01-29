"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
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

  const { callApi } = UseAPI();
  const { syncQuotas, user } = useAppContext();

  // Use a ref to track if we are already fetching to prevent "Network Changed" spam
  const isFetching = useRef(false);

  const fetchProducts = useCallback(async (silent = false) => {
    if (isFetching.current) return;
    if (!silent) setIsLoading(true);

    isFetching.current = true;
    try {
      const response = await callApi("/products/analyze");
      if (response?.data) {
        const products = response.data.analyzedProducts;
        const quotas = response.data.quotas;
        setAnalyzedProducts(products);

        const hasPending = products.some((p: any) => !p.is_ai_audited);
        const hasEnergy = quotas.audits_used < quotas.audits_limit;
        setIsBgAnalyzing(hasPending && hasEnergy);
      }
    } catch (error) {
      console.error("Fetch Products Error:", error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  }, [callApi]);

  const handleProductUpdated = (updated: any) => {
    setAnalyzedProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedProduct(updated);
  };

  // Real-time Neural Link
  useEffect(() => {
    if (!user?.id) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    // Use environment variable for the URL
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
    const ws = new WebSocket(`${wsUrl}?token=${token}&type=dashboard`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "AUDIT_PROGRESS" || data.type === "AUDIT_COMPLETE") {
          // fetchProducts(true) updates the counts automatically
          fetchProducts(true);
          syncQuotas();
        }
      } catch (e) {
        console.error("WS Parsing Error", e);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [user?.id, fetchProducts, syncQuotas]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
            onProductUpdated={handleProductUpdated}
            isBgAnalyzing={isBgAnalyzing}
            enhanceQuota={user?.quotas ? user.quotas.enhance_limit - user.quotas.enhance_used : 0}
            setEnhanceQuota={syncQuotas}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsAnalysisCom;