"use client"

import RegisterContent from '@/components/registrationHook/FounderRegistration'
import { ClivaStarsBackground } from '@/components/Stars'
import { Loader } from '@/components/ui/Loader'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen font-inter bg-[#050505] antialiased overflow-x-hidden relative flex items-center justify-center p-4">
          {/* 1. Nebula Background Effect */}
          <ClivaStarsBackground density={200} />
    
          {/* 2. Main Content Wrapper */}
          <div className="py-12 w-full max-w-xl">
            <React.Suspense fallback={<Loader />}>
              <RegisterContent />
            </React.Suspense>
          </div>
        </div>
  )
}

export default page
