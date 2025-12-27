"use client";
import React, { useState, useEffect, useCallback } from "react";
import SkeletonGrid from "./SkeletonGrid";
import { UseAPI } from "@/components/hooks/UseAPI";
import { Product } from "@/types";
import OverviewProductCardGrid from "./ProductCard";
import { useAppContext } from "@/components/AppContext";

const ProductOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const { callApi } = UseAPI();
  const { syncQuotas } = useAppContext();

  const fetchProducts = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await callApi("/products/analyze");
      if (response?.data && response.data.analyzedProducts) {
        // Mapping SKU and ensuring snake_case compatibility
        const productsWithSku = response.data.analyzedProducts.map(
          (p: any) => ({
            ...p,
            sku: p.sku || p.external_id || p.id.toString().substring(0, 8).toUpperCase(),
          }),
        );
        setProducts(productsWithSku);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [callApi]);

  // --- NEURAL LINK (WebSocket) ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) return;

      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}&type=dashboard`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Refresh catalog if an audit finished or quotas changed
        if (data.type === "AUDIT_COMPLETE" || data.type === "QUOTA_UPDATE") {
          fetchProducts(true); // Silent refresh
          syncQuotas();
        }
      };

      return () => ws.close();
    }
  }, [fetchProducts, syncQuotas]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSelectProduct = (product: Product | null) => {
    if (product) {
      console.log("Strategic Overview Focus:", product.name);
    }
  };

  return (
    <div className="mt-5 ml-6">
      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <OverviewProductCardGrid
          products={products}
          onSelectedProduct={handleSelectProduct}
        />
      )}
    </div>
  );
};

export default ProductOverview;