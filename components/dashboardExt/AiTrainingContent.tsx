'use client'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../AppContext'
import ProductsOverview from './tabs/productAnalysis/ProductsOverview'

const AiTrainingContent = () => {
  const { isDarkMode } = useAppContext()
  const [activeTab, setActiveTab] = useState<number>(1)

  return (
    <div className={`py-4 px-2 w-full h-full ${isDarkMode ? "bg-[#000] text-white" : ""} shadow-2xl`}>
      <div className="tabs fixed right-10 left-[300px] bg-[#000] z-20 py-4 px-3 rounded-lg flex justify-between items-center ml-10">
        <div className=' flex gap-5'>
          <div className={`rounded-md shadow-2xl  h-[40px] px-4 flex items-center cursor-pointer hover:scale-[1.01] transition-all duration-300 ${activeTab === 1 ? "bg-[#1C2526]" : "bg-[#333333]"}`}
            onClick={() => setActiveTab(1)}
          >
            Products Overview
          </div>

          <div className={`rounded-md shadow-2xl h-[40px] px-4 flex items-center cursor-pointer hover:scale-[1.01] transition-all duration-300 ${activeTab === 2 ? "bg-[#1C2526]" : "bg-[#333333]"}`}
            onClick={() => setActiveTab(2)}
          >
            Selling Points
          </div>
        </div>

        <div className='absolute right-4'>
          <input type="text" className='border rounded-md h-8 w-[280px] px-2 placeholder:text-gray-600 placeholder:italic' placeholder='search...' />
        </div>
      </div>


      <div className="TabContents">
        {activeTab === 1 && (
          <ProductsOverview />
        )}
      </div>
    </div>
  )
}

export default AiTrainingContent
