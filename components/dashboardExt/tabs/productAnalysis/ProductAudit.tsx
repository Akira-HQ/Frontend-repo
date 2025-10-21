'use client'
import React from 'react'
import { HiSparkles } from 'react-icons/hi2'
import { IoClose } from 'react-icons/io5'
import {
  IoCheckmarkCircle,
  IoWarning,
  IoCloseCircle
} from 'react-icons/io5'


type AuditCheck = {
  id: string;
  met: boolean;
  text: string;
}

type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  status: 'Strong' | 'Weak';
  health: number;
  reasons: string[];
  auditChecklist: AuditCheck[];
  stock: number; // <-- ADD THIS LINE
  price: number; // <-- ADD THIS LINE
}

interface Audit {
  product: Product | null; 
  onSelect: (product: Product | null) => void
}


type CheckStatus = 'pass' | 'warn' | 'fail';

const AuditChecklistItem = ({ status, text }: { status: CheckStatus, text: string }) => {
  const icon = {
    pass: <IoCheckmarkCircle className="text-green-500" />,
    warn: <IoWarning className="text-yellow-500" />,
    fail: <IoCloseCircle className="text-red-500" />,
  }[status];

  const textColor = {
    pass: 'text-gray-300',
    warn: 'text-yellow-400',
    fail: 'text-red-400',
  }[status];

  return (
    <div className={`flex items-center gap-2 ${textColor}`}>
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  )
}


// --- REFATORED AUDIT COMPONENT ---
const ProductAudit = ({ product, onSelect }: Audit) => {
  if (!product) {
    return (
      <div className='h-[500px] flex flex-col items-center  bg-[#0f1117] rounded-lg p-6 '>
        <div className="text-center mt-20">
          <p className="text-gray-400">Select a product to view its AI audit.</p>
          <p className="text-sm text-gray-500 mt-2">Click on any product to the left to see its analysis.</p>
        </div>
      </div>
    )
  }

  // --- NEW: Analysis Logic ---
  // We re-run the analyzer's logic here to build the checklist

  // 1. Description Check
  const descLength = product.description?.length || 0;
  let descStatus: CheckStatus = 'fail';
  let descText = 'Description is too short (under 50 chars)';
  if (descLength >= 150) {
    descStatus = 'pass';
    descText = 'Detailed description (over 150 chars)';
  } else if (descLength >= 50) {
    descStatus = 'warn';
    descText = 'Description is okay (50-150 chars)';
  }

  // 2. Image Check
  const imgStatus: CheckStatus = product.imageUrl ? 'pass' : 'fail';
  const imgText = imgStatus === 'pass' ? 'Product image is present' : 'Missing product image';

  // 3. Stock Check
  let stockStatus: CheckStatus = 'fail';
  let stockText = 'Product is out of stock';
  if (product.stock > 10) {
    stockStatus = 'pass';
    stockText = `Good stock level (${product.stock} items)`;
  } else if (product.stock > 0) {
    stockStatus = 'warn';
    stockText = `Stock is low (${product.stock} items)`;
  }

  // 4. Price Check
  const priceStatus: CheckStatus = product.price > 0 ? 'pass' : 'fail';
  const priceText = priceStatus === 'pass' ? 'Valid price is set' : 'Price is invalid or not set';


  return (
    <>
      <div className="rounded-lg p-6 animate-fade-in bg-[#0f1117] relative">
        <IoClose
          className='absolute right-2 top-2 text-xl cursor-pointer bg-gray-800 w-6 h-6 rounded-lg '
          onClick={() => onSelect(null)}
        />

        {/* Use a placeholder if image is missing */}
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className='h-[250px] mb-4 rounded w-full object-cover' />
        ) : (
          <div className='h-[250px] mb-4 rounded w-full bg-gray-900 flex items-center justify-center'>
            <span className='text-gray-500'>No Image</span>
          </div>
        )}

        <h3 className='text-lg font-bold text-white'>{product.name}</h3>

        {/* --- NEW: AI AUDIT CHECKLIST --- */}
        <div className="my-4 p-3 bg-gray-900/70 rounded-lg space-y-2">
          <h4 className='text-sm font-semibold text-gray-300 mb-3'>AI Audit Checklist</h4>
          <AuditChecklistItem status={descStatus} text={descText} />
          <AuditChecklistItem status={imgStatus} text={imgText} />
          <AuditChecklistItem status={stockStatus} text={stockText} />
          <AuditChecklistItem status={priceStatus} text={priceText} />
        </div>

        {/* --- DESCRIPTION BOX (Unchanged) --- */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-300">Description</label>
          <p className="text-sm text-gray-400 mt-2 bg-gray-900 p-3 rounded-md max-h-40 overflow-y-auto">
            {product.description ? product.description : "No description for this product"}
          </p>
          <button className="mt-3 text-sm font-semibold text-blue-400 hover:text-blue-300 flex gap-1 items-center">
            <HiSparkles className='text-yellow-400' /> Enhance with AI
          </button>
        </div>
      </div>
    </>
  )
}

export default ProductAudit