'use client'
import React from 'react'
import { HiSparkles } from 'react-icons/hi2'
import { IoClose } from 'react-icons/io5';

type Product = {
  id: string; // The database ID is a string
  name: string;
  description: string | null;
  imageurl: string | null; // Matches your DB schema
  status: 'Strong' | 'Weak';
  health: number;
  reasons: string[];
}

interface Audit {
  product: any;
  onSelect: (product: Product | null) => void
}

const ProductAudit = ({ product, onSelect }: Audit) => {
  if (!product) {
    return (
      <div className='h-[500px] flex flex-col items-center  bg-[#0f1117] rounded-lg p-6 '>
       <div className="text-center mt-20">
          <p className="text-gray-400">Select a product to view its AI audit.</p>
          <p className="text-sm text-gray-500 mt-2">Here you can enhance descriptions, analyze images, and more.</p>
       </div>
      </div>
    )
  }
  return (
    <>
      <div className="rounded-lg p-6 animate-fade-in bg-[#0f1117]  relative">
        <IoClose className='absolute right-2 top-2 text-xl cursor-pointer bg-gray-800 w-6 h-6 rounded-lg ' onClick={() => onSelect(null)} />
          <img src={product.imageUrl} alt="product image" className='h-[250px] mb-4 rounded w-full' />
        <h3 className='text-lg font-bold text-white'>{product.name}</h3>

        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-300">Description</label>
          <p className="text-sm text-gray-400 mt-2 bg-gray-900 p-3 rounded-md">{product.description ? product.description : "No description for this product"}</p>
          <button className="mt-3 text-sm font-semibold text-blue-400 hover:text-blue-300 flex gap-1">
            <HiSparkles className='text-yellow-400' /> Enhace with AI
          </button>
        </div>
      </div>
    </>
  )
}

export default ProductAudit
