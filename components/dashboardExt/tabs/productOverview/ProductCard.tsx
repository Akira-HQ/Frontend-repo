"use client";
import {
  Package,
  Tag,
  Zap,
  Code,
  Barcode,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Product } from "@/types";

// --- 3. MOCK/INTERNAL OverviewProductCardGrid Component (Defined for compilation) ---
interface OverviewProductCardGridProps {
  products: Product[];
  onSelectedProduct: (product: Product | null) => void;
}

const OverviewProductCardGrid = ({
  products,
  onSelectedProduct,
}: OverviewProductCardGridProps) => {
  // FIX: Safely parse price to number before using toFixed
  const formatPrice = (price: number | string) => {
    const numericPrice = parseFloat(String(price));
    if (isNaN(numericPrice) || numericPrice <= 0) return "N/A";

    // Using International Number Format for robust currency display and handling large numbers
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(numericPrice);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        label: "Out of Stock",
        color: "text-red-400",
        bg: "bg-red-900/30",
        icon: Code,
      };
    if (stock < 10)
      return {
        label: "Low Stock",
        color: "text-yellow-400",
        bg: "bg-yellow-900/30",
        icon: Tag,
      };
    return {
      label: "In Stock",
      color: "text-green-400",
      bg: "bg-green-900/30",
      icon: Package,
    };
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-white mb-4">
        Full Catalog Overview ({products.length} Items)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const stockInfo = getStockStatus(product.stock);
          const healthColor =
            product.health > 65 ? "bg-[#A500FF]" : "bg-[#FFB300]";
          const StockIcon = stockInfo.icon;

          return (
            <div
              key={product.id}
              className="
                        bg-[#0f1117] rounded-xl overflow-hidden shadow-2xl border border-gray-800 
                        transform transition duration-300 hover:scale-[1.02] hover:border-[#FFB300]
                        cursor-pointer relative flex flex-col
                    "
              onClick={() => onSelectedProduct(product)}
            >
              {/* Product Image */}
              <div className="h-40 bg-gray-900 flex items-center justify-center relative">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img
                    src={
                      product.imageUrls[0] ||
                      "https://placehold.co/400x160/1f2937/FFFFFF?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-300"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://placehold.co/400x160/1f2937/FFFFFF?text=No+Image";
                    }}
                  />
                ) : (
                  <span className="text-gray-500 text-sm">
                    No Image Available
                  </span>
                )}

                {/* Price Tag & AI Overview Score */}
                <div
                  className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full ${healthColor} text-white shadow-md flex items-center gap-1`}
                >
                  <Zap className="w-3 h-3 text-[#FFB300]" />
                  <span>{product.health}%</span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-4 flex-grow">
                <h3 className="text-lg font-bold text-white truncate mb-1">
                  {product.name}
                </h3>

                {/* SKU and Price */}
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                    <Barcode className="w-3 h-3" />{" "}
                    {product.sku || product.id.substring(0, 8)}
                  </span>
                  <span className="font-bold text-[#00A7FF] flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />{" "}
                    {formatPrice(product.price)}
                  </span>
                </div>

                {/* Stock Status Label */}
                <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
                  <span className="text-sm text-gray-400 flex items-center gap-2">
                    <StockIcon className={`w-4 h-4 ${stockInfo.color}`} />
                    {stockInfo.label}
                  </span>
                  <span className={`text-sm font-semibold ${stockInfo.color}`}>
                    {product.stock} units
                  </span>
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
