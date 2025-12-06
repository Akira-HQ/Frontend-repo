'use client'
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'

// Mock Lucide Icons (to ensure necessary icons are available)
import SkeletonGrid from './SkeletonGrid';
import { UseAPI } from '@/components/hooks/UseAPI';
import { Product } from '@/types';
import OverviewProductCardGrid from './ProductCard';



const ProductOverview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // Hook call is correctly placed inside the functional component body
  const { callApi } = UseAPI();

  // Since this is a dedicated Overview tab, we fetch data on mount.
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await callApi('/products/analyze');
        if (response.data && response.data.analyzedProducts) {
          // Injecting SKU based on externalId or ID, as per your database logic
          const productsWithSku = response.data.analyzedProducts.map((p: Product) => ({
            ...p,
            sku: (p as any).externalId || p.id.substring(0, 8).toUpperCase()
          }));
          setProducts(productsWithSku);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // In the Overview tab, clicking a product doesn't necessarily open the Audit, 
  // but the card component still needs the prop. We'll simply console log for now.
  const handleSelectProduct = (product: Product | null) => {
    if (product) {
      console.log("Product clicked in Overview Tab:", product.name);
    }
  };

  return (
    <div className='mt-5 ml-6'>
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