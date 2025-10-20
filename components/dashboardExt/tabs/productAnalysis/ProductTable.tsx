'use client'
import React from 'react'

type Product = {
  id: string; // The database ID is a string
  name: string;
  description: string | null;
  imageurl: string | null; // Matches your DB schema
  status: 'Strong' | 'Weak';
  health: number;
  reasons: string[];
}

interface ProductTableProps {
  products: Product[] | null;
  selectedProduct: Product | null;
  onSelectedProduct: (product: Product | null) => void
}

const ProductTable = ({ products, selectedProduct, onSelectedProduct }: ProductTableProps) => {
  return (
    <div className='flex flex-col gap-3'>
      <div className="grid grid-cols-12 gap-4 px-4 text-sm font-semibold text-gray-400">
        {/* <div className="col-span-5">ID</div> */}
        <div className="col-span-5">Product</div>
        <div className="col-span-3">Status</div>
        <div className="col-span-4">Health</div>
      </div>

      {products?.map((product) => (
        <div key={product.id}
          onClick={() => onSelectedProduct(product)}
          className={`grid grid-cols-12 gap-4 items-center p-4 rounded-lg bg-[#0f1117] shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${selectedProduct?.id === product.id ? 'ring-2 ring-blue-500' : "ring-0"}`}
        >
          <div className="col-span-5 flex item-center gap-4">
            <span className='font-medium text-white'>{product.name}</span>
          </div>

          <div className="col-span-3">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.status === "Strong" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
              {product.status}
            </span>
          </div>

          <div className="col-span-4 flex items-center gap-2">
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div className={`h-1.5 rounded-full ${product.health > 65 ? "bg-green-500" : "bg-yellow-500"}`} style={{ width: `${product.health}%` }}></div>
            </div>
            <span className="text-sm text-gray-300">
              {product.health}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductTable
