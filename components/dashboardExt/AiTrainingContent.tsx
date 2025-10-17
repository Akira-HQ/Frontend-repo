'use client'
import React, { useState } from 'react'
import { useAppContext } from '../AppContext'

const AiTrainingContent = () => {
  const {isDarkMode} = useAppContext()
  const [activeTab, setActiveTab] = useState<number>(1)

  return (
    <div className={`py-5 px-2 w-full h-full ${isDarkMode ? "bg-[#000] text-white" : ""} shadow-2xl`}>
      <div className="tabs flex justify-between items-center ml-10">
        <div className=' flex gap-5'>
          <div className={`rounded-md shadow-2xl  h-[40px] px-4 flex items-center cursor-pointer hover:scale-[1.01] transition-all duration-300 ${activeTab === 1 ? "bg-[#1C2526]" : "bg-[#333333]"}`}
            onClick={() => setActiveTab(1)}
          >
            Products Overview
          </div>

          <div className={`rounded-md shadow-2xl h-[40px] px-4 flex items-center cursor-pointer hover:scale-[1.01] transition-all duration-300 ${activeTab === 2 ? "bg-[#1C2526]" : "bg-[#333333]"}`}
            onClick={() => setActiveTab(2)}
          >
            AI Audit Summary
          </div>
        </div>

        <div>
          <input type="text" className='border rounded-md h-8 w-[280px] px-2 placeholder:text-gray-600 placeholder:italic' placeholder='search...' />
        </div>
      </div>
    </div>
  )
}

export default AiTrainingContent
