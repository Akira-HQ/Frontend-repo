"use client";
import React, { useEffect, useState, useRef } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi2";
import ProductTable from "./ProductTable";
import ProductAudit from "./ProductAudit";
import ProductTableSkeleton from "./ProductTableSkeleton";
import { UseAPI } from "@/components/hooks/UseAPI";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrls: string[] | null;
  status: "Strong" | "Weak";
  health: number;
  thinking_process?: string;
  reasons: string[];
  stock: number;
  price: number;
  is_ai_audit?: boolean;
};

type AnalysisSummary = {
  totalProducts: number;
  strongCount: number;
  weakCount: number;
  healthScore: number;
};

const ProductsAnalysisCom = () => {
  const [analysisView, setAnalysisView] = useState<"summary" | "weak" | "closed">("summary");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analyzedProducts, setAnalyzedProducts] = useState<Product[]>([]);
  const [analysisSummary, setAnalysisSummary] = useState<AnalysisSummary | null>(null);

  // NEW: Quota & Background Tracking States
  const [enhanceQuota, setEnhanceQuota] = useState(0);
  const [isBgAnalyzing, setIsBgAnalyzing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const { callApi } = UseAPI();

  const fetchAndAnalyzeProducts = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    try {
      const response = await callApi("/products/analyze");
      if (response?.data) {
        setAnalyzedProducts(response.data.analyzedProducts);
        setAnalysisSummary(response.data.analysisSummary);
        setEnhanceQuota(response.data.quotas.enhance); // LIVE FETCH FROM DB
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  // Initial load
  useEffect(() => {
    fetchAndAnalyzeProducts(true);
  }, []);

  // Background Polling Logic: Refreshes data while Cliva is auditing
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isBgAnalyzing && !isLoading) {
      interval = setInterval(() => {
        // Silent update to catch newly audited products
        fetchAndAnalyzeProducts(false);
      }, 10000); // Poll every 10 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBgAnalyzing, isLoading]);

  const handleProductUpdated = (updated: Product) => {
    setAnalyzedProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    // Maintain selection but update data
    setSelectedProduct(updated);
  };

  return (
    <div className="mt-20 px-6 max-w-[1600px] mx-auto pb-20">
      {/* 1. Header Summary Card */}
      {analysisSummary && (
        <div className={`mb-10 p-6 bg-[#0b0b0b] border border-white/5 rounded-3xl transition-all duration-500 overflow-hidden shadow-2xl
          ${analysisView === 'closed' ? 'max-h-20' : 'max-h-[500px]'}`}>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <HiSparkles className="text-amber-500 text-2xl animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Cliva Strategic Audit</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">WWG Compliance: {analysisSummary.healthScore}%</p>
              </div>
            </div>
            <button
              onClick={() => setAnalysisView(analysisView === 'closed' ? 'summary' : 'closed')}
              className="p-2 hover:bg-white/5 rounded-full transition-colors border border-white/5 text-gray-400"
            >
              {analysisView === "closed" ? <BiChevronDown size={24} /> : <BiChevronUp size={24} />}
            </button>
          </div>

          {analysisView !== "closed" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-4 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Inventory Health</span>
                  <span className="text-green-400 font-bold">{analysisSummary.healthScore}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-600 to-green-500 transition-all duration-1000" style={{ width: `${analysisSummary.healthScore}%` }} />
                </div>
                <p className="text-sm text-gray-400 leading-relaxed italic border-l-2 border-amber-500/30 pl-4">
                  "I've analyzed {analysisSummary.totalProducts} products. {analysisSummary.weakCount} units currently fall below conversion standards."
                </p>
              </div>

              <div className="flex flex-col justify-center gap-4">
                <button
                  onClick={() => setAnalysisView("weak")}
                  className="group flex items-center justify-between px-6 py-4 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 rounded-2xl transition-all text-left"
                >
                  <div>
                    <span className="text-white font-semibold block">Review Weak Points</span>
                    <span className="text-[10px] text-gray-500 uppercase font-black">Requires Optimization</span>
                  </div>
                  <div className="px-2 py-1 bg-amber-500 text-black text-[10px] font-black rounded-md">{analysisSummary.weakCount}</div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Main content area */}
      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 lg:col-span-8">
          <div className="flex justify-between items-end mb-6 px-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Live Inventory</h2>
            {isBgAnalyzing && (
              <div className="flex items-center gap-2 px-3 py-1 bg-[#A500FF]/10 border border-[#A500FF]/20 rounded-full animate-pulse">
                <div className="w-1.5 h-1.5 bg-[#A500FF] rounded-full" />
                <span className="text-[10px] font-bold text-[#A500FF] uppercase tracking-widest">AI Auditing Active</span>
              </div>
            )}
          </div>

          {isLoading ? <ProductTableSkeleton /> :
            <ProductTable
              products={analyzedProducts}
              selectedProduct={selectedProduct}
              onSelectedProduct={setSelectedProduct}
            />
          }
        </div>

        {/* 3. The Sticky Audit Panel */}
        <div className="col-span-12 lg:col-span-4 sticky top-24">
          <ProductAudit
            product={selectedProduct}
            onSelect={setSelectedProduct}
            onProductUpdated={handleProductUpdated}
            enhanceQuota={enhanceQuota} // PASS LIVE QUOTA
            setEnhanceQuota={setEnhanceQuota}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsAnalysisCom;