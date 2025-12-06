'use client'
import React, { useEffect, useState } from 'react'
import { BiChevronDown, BiChevronUp, BiArrowBack } from 'react-icons/bi'
import { HiSparkles } from 'react-icons/hi2'
import ProductTable from './ProductTable'
import ProductAudit from './ProductAudit'
import ProductTableSkeleton from './ProductTableSkeleton'
import { UseAPI } from '@/components/hooks/UseAPI'



type AuditCheck = {
  id: string;
  met: boolean;
  text: string;
}

type Product = {
  id: string;
  name: string;
  description: string | null;
  imageUrls: string[] | null; // <-- CORRECT (array of strings)
  status: 'Strong' | 'Weak';
  health: number;
  reasons: string[];
  auditChecklist: AuditCheck[];
  stock: number;
  price: number;
}

type AnalysisSummary = {
  totalProducts: number;
  strongCount: number;
  weakCount: number;
  healthScore: number;
}

const ProductsAnalysisCom = () => {
  const [analysisView, setAnalysisView] = useState<'summary' | 'weak' | 'closed'>('summary');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [analyzedProducts, setAnalyzedProducts] = useState<Product[]>([])
  const [analysisSummary, setAnalysisSummary] = useState<AnalysisSummary | null>(null);

  const { callApi } = UseAPI()

  // ... (useEffect is unchanged) ...
  useEffect(() => {
    const fetchAndAnalyzeProducts = async () => {
      setIsLoading(true);
      try {
        const response = await callApi('/products/analyze');
        if (response.data) {
          setAnalysisSummary(response.data.analysisSummary);
          setAnalyzedProducts(response.data.analyzedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch and analyze products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndAnalyzeProducts();
  }, [callApi]);

  const handleProductUpdated = (updatedProduct: Product) => {
    setAnalyzedProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === updatedProduct.id ? updatedProduct : p
      )
    );

   
    setSelectedProduct(updatedProduct);
  };


  return (
    <div className='mt-20 ml-6'>

      {analysisSummary && (
        <div className={`analysis px-4 py-2 overflow-hidden transition-all duration-300 ease-in bg-[#0b0b0b] rounded-2xl w-[450px] flex flex-col ${analysisView === 'closed' ? 'max-h-[40px]' :
            analysisView === 'summary' ? 'max-h-48' : 
              'max-h-[450px]'
          }`}>

          <div className="flex justify-between items-center flex-shrink-0"> 
            <h3 className='flex items-center gap-3'>
              <HiSparkles className='text-yellow-300' />Products analysis
            </h3>
            {analysisView === 'closed' ? (
              <BiChevronDown className='text-2xl cursor-pointer' onClick={() => setAnalysisView('summary')} />
            ) : (
              <BiChevronUp className='text-2xl cursor-pointer' onClick={() => setAnalysisView('closed')} />
            )}
          </div>

          <hr className='my-2 opacity-15 flex-shrink-0' /> {/* Added flex-shrink-0 */}

          {/* --- SUMMARY VIEW (Unchanged, will fit in max-h-48) --- */}
          {analysisView === 'summary' && (
            <div className="animate-fade-in">
              <p>Analyzed {analysisSummary.totalProducts} products from your store.</p>
              <p>{analysisSummary.strongCount}/{analysisSummary.totalProducts} meet training criteria.</p>

              <div className={`h-2 bg-white mt-2 rounded-3xl overflow-hidden`}>
                <div className={`h-2 bg-green-600 rounded-3xl`} style={{ width: `${analysisSummary.healthScore}%` }}></div>
              </div>

              <div className="actions mt-3 flex justify-between">
                <button
                  className='flex items-center gap-1 px-3 py-1 bg-[#0f1117] cursor-pointer rounded-lg shadow-lg'
                  onClick={() => setAnalysisView('weak')}
                >
                  <HiSparkles className='text-yellow-300' /> View {analysisSummary.weakCount} weak products
                </button>
                <button className='flex items-center gap-1 px-3 py-1 rounded-lg shadow-lg bg-[#0f1117] cursor-pointer'>
                  <HiSparkles className='text-yellow-300' /> Test strong products
                </button>
              </div>
            </div>
          )}

          {analysisView === 'weak' && (
            
            <div className="animate-fade-in flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                <BiArrowBack className="text-xl cursor-pointer hover:text-white" onClick={() => setAnalysisView('summary')} />
                <h4 className="font-semibold text-white">Weak Products ({analysisSummary.weakCount})</h4>
              </div>

             
              <div className="flex flex-col gap-3 overflow-y-auto pr-2">
                {analyzedProducts
                  .filter(p => p.status === 'Weak')
                  .map(product => (
                    <div key={product.id} className="bg-[#0f1117] p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-white">{product.name}</span>
                        <button className="text-xs px-3 py-1 bg-blue-600/50 rounded text-blue-100 opacity-70 cursor-not-allowed">
                          Enhance
                        </button>
                      </div>
                      <ul className="list-disc list-inside text-sm text-yellow-400 mt-2 space-y-1">
                        {product.reasons.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          )}
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
                  <ProductTable
                    products={analyzedProducts}
                    selectedProduct={selectedProduct}
                    onSelectedProduct={(product) => setSelectedProduct(product)}
                  />
              )}
            </div>
            <div className="lg-col-span-1">
              <ProductAudit
                product={selectedProduct}
                onSelect={(product) => setSelectedProduct(product)}
                onProductUpdated={handleProductUpdated} // <-- MAKE SURE THIS PROP IS PASSED
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsAnalysisCom