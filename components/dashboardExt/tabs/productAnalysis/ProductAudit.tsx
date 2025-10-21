'use client'
// --- MODIFIED: Added imports ---
import React, { useState, useEffect } from 'react'
import { HiSparkles } from 'react-icons/hi2'
import { IoClose, IoLockClosed } from 'react-icons/io5'
import {
  IoCheckmarkCircle,
  IoWarning,
  IoCloseCircle
} from 'react-icons/io5'
// --- MODIFIED: Added import ---
import { UseAPI } from '@/components/hooks/UseAPI'
import { HiOutlineSave } from 'react-icons/hi';
import { IoAddCircleOutline } from 'react-icons/io5';


type AuditCheck = {
  id: string;
  met: boolean;
  text: string;
}

type Product = {
  id: string;
  name: string;
  description: string | null;
  // --- FIXED: Should be an array of strings ---
  imageUrls: string[] | null;
  status: 'Strong' | 'Weak';
  health: number;
  reasons: string[];
  auditChecklist: AuditCheck[];
  stock: number;
  price: number;
}

interface Audit {
  product: Product | null;
  onSelect: (product: Product | null) => void;
  onProductUpdated: (updatedProduct: Product) => void;
}

type CheckStatus = 'pass' | 'warn' | 'fail';

const AuditChecklistItem = ({ status, text }: { status: CheckStatus, text: string }) => {
  // ... (This component is unchanged)
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


const ProductAudit = ({ product, onSelect, onProductUpdated }: Audit) => {
  const { callApi } = UseAPI();
  const isPremium = false;
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editableDescription, setEditableDescription] = useState(product?.description || '');

  // --- NEW: State for the currently displayed image ---
  const [displayImage, setDisplayImage] = useState<string | null>(null);

  useEffect(() => {
    setEditableDescription(product?.description || '');
    // --- NEW: Set the display image when the product changes ---
    // Default to the first image in the array
    if (product?.imageUrls && product.imageUrls.length > 0) {
      setDisplayImage(product.imageUrls[0]);
    } else {
      setDisplayImage(null); // Reset if no images
    }
  }, [product]);


  const handleEnhanceDescription = async () => {
    // ... (This function is correct, no changes)
    if (!product || !isPremium) return;
    setIsEnhancing(true);
    try {
      const response = await callApi('/products/enhance-description', "POST", {
        productId: product.id,
        description: editableDescription,
        productName: product.name,
      });

      if (response.data) {
        onProductUpdated(response.data);
      }
    } catch (error) {
      console.error("Failed to enhance:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSaveChanges = async () => {
    // ... (This function is correct, no changes)
    if (!product) return;

    setIsSaving(true);
    try {
      const response = await callApi('/products/update-description', "POST", {
        productId: product.id,
        description: editableDescription,
      });

      if (response.data) {
        onProductUpdated(response.data);
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };


  if (!product) {
    // ... (This 'no product' view is correct, no changes)
    return (
      <div className='h-[500px] flex flex-col items-center  bg-[#0f1117] rounded-lg p-6 '>
        <div className="text-center mt-20">
          <p className="text-gray-400">Select a product to view its AI audit.</p>
          <p className="text-sm text-gray-500 mt-2">Click on any product to the left to see its analysis.</p>
        </div>
      </div>
    )
  }

  // --- Checklist Logic ---
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

  // --- FIXED: Use the new displayImage state ---
  const imgStatus: CheckStatus = (product.imageUrls && product.imageUrls.length > 0) ? 'pass' : 'fail';
  // --- FIXED: Completed the text ---
  const imgText = imgStatus === 'pass' ? 'Product image is present' : 'Missing product image';

  let stockStatus: CheckStatus = 'fail';
  let stockText = 'Product is out of stock';
  if (product.stock > 10) {
    stockStatus = 'pass';
    stockText = `Good stock level (${product.stock} items)`;
  } else if (product.stock > 0) {
    stockStatus = 'warn';
    stockText = `Stock is low (${product.stock} items)`;
  }

  const priceStatus: CheckStatus = product.price > 0 ? 'pass' : 'fail';
  const priceText = priceStatus === 'pass' ? 'Valid price is set' : 'Price is invalid or not set';


  return (
    <>
      <div className="rounded-lg p-6 animate-fade-in bg-[#0f1117] relative">
        <IoClose
          className='absolute right-2 top-2 text-xl cursor-pointer bg-gray-800 w-6 h-6 rounded-lg '
          onClick={() => onSelect(null)}
        />

        {/* --- MODIFIED: Main Image Display --- */}
        <div className="mb-4">
          {displayImage ? (
            // --- FIXED: Use displayImage state variable ---
            <img src={displayImage} alt={product.name} className='h-[250px] mb-4 rounded w-full object-cover' />
          ) : (
            // --- FIXED: Added "Add Image" button ---
            <div className='h-[250px] mb-4 rounded w-full bg-gray-900 flex flex-col items-center justify-center gap-2'>
              <span className='text-gray-500'>No Image</span>
              <button className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300">
                <IoAddCircleOutline />
                Add Image
              </button>
            </div>
          )}
        </div>

        {/* --- NEW: Image Gallery/Upload Row --- */}
        <div className="flex items-center gap-2 mb-4">
          {/* Map over all images to show thumbnails */}
          {product.imageUrls && product.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt="thumbnail"
              // When clicked, update the main display image
              onClick={() => setDisplayImage(url)}
              className={`w-12 h-12 rounded object-cover cursor-pointer ${
                // Highlight the thumbnail that matches the main display image
                displayImage === url ? 'ring-2 ring-blue-500' : 'ring-0'
                }`}
            />
          ))}

          {/* "Add More" button */}
          <button className="w-12 h-12 rounded bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white">
            <IoAddCircleOutline className="text-2xl" />
          </button>
        </div>

        <h3 className='text-lg font-bold text-white'>{product.name}</h3>

        {/* --- Checklist --- */}
        <div className="my-4 p-3 bg-gray-900/70 rounded-lg space-y-2">
          <h4 className='text-sm font-semibold text-gray-300 mb-3'>AI Audit Checklist</h4>
          <AuditChecklistItem status={descStatus} text={descText} />
          <AuditChecklistItem status={imgStatus} text={imgText} />
          <AuditChecklistItem status={stockStatus} text={stockText} />
          <AuditChecklistItem status={priceStatus} text={priceText} />
        </div>

        {/* --- Description Box and Buttons --- */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-gray-300">Description</label>

          <textarea
            className="w-full text-sm text-gray-400 mt-2 bg-gray-900 p-3 rounded-md max-h-40 min-h-[120px] overflow-y-auto"
            value={editableDescription}
            onChange={(e) => setEditableDescription(e.target.value)}
            placeholder="No description for this product"
          />

          <div className="mt-3 flex items-center gap-3">
            {/* ... (Enhance Button - correct, no changes) ... */}
            <button
              className={`text-sm font-semibold flex gap-1 items-center px-3 py-1.5 rounded-lg
                ${isPremium
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-gray-500 bg-gray-800 cursor-not-allowed'
                } 
                disabled:opacity-50 disabled:cursor-wait`}
              onClick={handleEnhanceDescription}
              disabled={isEnhancing || isSaving || !isPremium}
            >
              {isPremium ? (
                <HiSparkles className={`text-yellow-400 ${isEnhancing ? 'animate-spin' : ''}`} />
              ) : (
                <IoLockClosed className="text-yellow-600" />
              )}
              {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
            </button>

            {/* ... (Save Button - correct, no changes) ... */}
            <button
              className="text-sm font-semibold text-gray-300 hover:text-white flex gap-1 items-center px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-wait"
              onClick={handleSaveChanges}
              disabled={isEnhancing || isSaving}
            >
              <HiOutlineSave className={`${isSaving ? 'animate-spin' : ''}`} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {!isPremium && (
            <p className="text-xs text-yellow-500 mt-2">
              <HiSparkles className="inline mr-1" />
              'Enhance with AI' is a premium feature.
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductAudit