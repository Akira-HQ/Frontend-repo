'use client'
import React, {useEffect, useState } from 'react'
import { BiChevronDown, BiChevronUp } from 'react-icons/bi'
import { HiSparkles } from 'react-icons/hi2'
import ProductTable from './ProductTable'
import ProductAudit from './ProductAudit'
import ProductTableSkeleton from './ProductTableSkeleton'
import { UseAPI } from '@/components/hooks/UseAPI'

// A more accurate type definition for your product data from the database
type Product = {
  id: string; // The database ID is a string
  name: string;
  description: string | null;
  imageurl: string | null; // Matches your DB schema
  status: 'Strong' | 'Weak';
  health: number;
  reasons: string[];
}

// Type for the summary object
type AnalysisSummary = {
  totalProducts: number;
  strongCount: number;
  weakCount: number;
  healthScore: number;
}

const ProductsOverview = () => {
  const [expandable, setExpandable] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // State for the full list of analyzed products
  const [analyzedProducts, setAnalyzedProducts] = useState<Product[]>([])
  // State for the summary data
  const [analysisSummary, setAnalysisSummary] = useState<AnalysisSummary | null>(null);

  const { callApi } = UseAPI()


  useEffect(() => {
    const fetchAndAnalyzeProducts = async () => {
      setIsLoading(true);
      try {
        // Call the new backend endpoint that performs the analysis
        const response = await callApi('/products/analyze');

        // Set the state with the data returned from the backend
        if (response.data) {
          setAnalysisSummary(response.data.analysisSummary);
          setAnalyzedProducts(response.data.analyzedProducts);
        }

      } catch (error) {
        console.error("Failed to fetch and analyze products:", error);
        // You can add a toast notification here for the error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndAnalyzeProducts();
  }, [callApi]);


  return (
    <div className='mt-20 ml-6'>

      {analysisSummary && (
        <div className={`analysis px-4 py-2 overflow-hidden transition-all duration-300 ease-in bg-[#0b0b0b] rounded-2xl w-[450px] ${!expandable ? "h-full" : "h-[40px]"}`}>
          <div className="flex justify-between items-center">
            <h3 className='flex items-center gap-3'>
              <HiSparkles className='text-yellow-300' />Products analysis
            </h3>
            {expandable ? <BiChevronDown className='text-2xl cursor-pointer' onClick={() => setExpandable(false)} /> : <BiChevronUp className='text-2xl cursor-pointer' onClick={() => setExpandable(true)} />}
          </div>

          <hr className='my-2 opacity-15' />

          <div>
            <p>Analyzed {analysisSummary.totalProducts} products from your store.</p>
            <p>{analysisSummary.strongCount}/{analysisSummary.totalProducts} meet training criteria.</p>

            <div className={`h-2 bg-white mt-2 rounded-3xl overflow-hidden`}>
              <div className={`h-2 bg-green-600 rounded-3xl`} style={{ width: `${analysisSummary.healthScore}%` }}></div>
            </div>

            <div className="actions mt-3 flex justify-between">
              <button className='flex items-center gap-1 px-3 py-1 bg-[#0f1117] cursor-pointer rounded-lg shadow-lg'>
                <HiSparkles className='text-yellow-300' /> View {analysisSummary.weakCount} weak products
              </button>
              <button className='flex items-center gap-1 px-3 py-1 rounded-lg shadow-lg bg-[#0f1117] cursor-pointer'>
                <HiSparkles className='text-yellow-300' /> Test strong products
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='mt-7'>
        <div className="product">
          <h2 className='text-2xl tracking-wide'>Products</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              {isLoading ? (
                <ProductTableSkeleton />
              ) : (
                <ProductTable products={analyzedProducts} selectedProduct={selectedProduct} onSelectedProduct={setSelectedProduct} />
              )}
            </div>

            <div className="lg:col-span-1">
              <ProductAudit product={selectedProduct} onSelect={setSelectedProduct} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsOverview

