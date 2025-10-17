'use client'
import React, { useState, useEffect } from 'react'
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import Button from './Button'
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from './AppContext';


const Header = () => {
  const router = useRouter()
  const { isDarkMode, setIsDarkMode, getStarted, initialLoadComplete } = useAppContext()
  const pathname = usePathname()

  return (
    <header className={`${isDarkMode ? 'bg-white/5' : "bg-pure border-[#601EF9] "} transition-colors duration-500 bg-white flex justify-between items-center px-5 py-1 border-white fixed top-0 right-0 left-0 backdrop-filter backdrop-blur-md z-50`}>
      <h1 className='main-text text-[36px] font-bold text-shimmer'>Akira AI</h1>

      {pathname === '/' && (
        <Button className='mr-14' onClick={() => router.push('/#pricings')}>Get Started</Button> 
      )}
      {/* {pathname !== '/' && (
        <input type="search" className='border border-white rounded-md mr-20 h-8 w-[250px]' placeholder='search...' />
      )} */}

      <div onClick={() => setIsDarkMode(!isDarkMode)} className='flex absolute right-5 top-5 text-3xl z-10'>
        {isDarkMode ? <BsMoonFill className='text-white' /> : <BsSunFill className='text-white' />}
      </div>
    </header>
  )
}

export default Header
