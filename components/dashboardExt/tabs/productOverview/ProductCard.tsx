"use client";
import {
  Package,
  Tag,
  Zap,
  Barcode,
  DollarSign,
} from "lucide-react";
import { Product } from "@/types";

interface OverviewProductCardGridProps {
  products: Product[];
  onSelectedProduct: (product: Product | null) => void;
}

const OverviewProductCardGrid = ({
  products,
  onSelectedProduct,
}: OverviewProductCardGridProps) => {
  const formatPrice = (price: number | string) => {
    const numericPrice = parseFloat(String(price));
    if (isNaN(numericPrice) || numericPrice <= 0) return "N/A";

    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(numericPrice);
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 0)
      return { label: "Out of Stock", color: "text-red-400", icon: Barcode };
    if (stock < 10)
      return { label: "Low Stock", color: "text-yellow-400", icon: Tag };
    return { label: "In Stock", color: "text-green-400", icon: Package };
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-white mb-4">
        Full Catalog Overview ({products.length} Items)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product: any) => {
          const stockInfo = getStockStatus(product.stock);
          // Aligned with health_score from Robust DB
          const healthScore = product.health_score || product.health || 0;
          const healthColor = healthScore > 65 ? "bg-[#A500FF]" : "bg-[#FFB300]";
          const StockIcon = stockInfo.icon;

          return (
            <div
              key={product.id}
              className="bg-[#0f1117] rounded-xl overflow-hidden shadow-2xl border border-gray-800 transform transition duration-300 hover:scale-[1.02] hover:border-[#A500FF] cursor-pointer relative flex flex-col"
              onClick={() => onSelectedProduct(product)}
            >
              {/* Product Image - Mapping image_urls */}
              <div className="h-40 bg-gray-900 flex items-center justify-center relative">
                <img
                  src={product.image_urls?.[0] || "https://placehold.co/400x160/1f2937/FFFFFF?text=No+Image"}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-90 transition duration-300"
                />

                <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full ${healthColor} text-white shadow-md flex items-center gap-1`}>
                  <Zap className="w-3 h-3 text-white" />
                  <span>{healthScore}%</span>
                </div>
              </div>

              <div className="p-4 flex-grow">
                <h3 className="text-lg font-bold text-white truncate mb-1">{product.name}</h3>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                    <Barcode className="w-3 h-3" /> {product.sku}
                  </span>
                  <span className="font-bold text-[#00A7FF] flex items-center gap-1">
                    <DollarSign className="w-4 h-4" /> {formatPrice(product.price)}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <StockIcon className={`w-4 h-4 ${stockInfo.color}`} />
                    {stockInfo.label}
                  </span>
                  <span className={`text-sm font-semibold ${stockInfo.color}`}>{product.stock} units</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewProductCardGrid;