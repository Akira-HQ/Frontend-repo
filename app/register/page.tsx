'use client';

import React, { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/components/AppContext';
import { UseAPI } from '../../components/hooks/UseAPI';
import Stars from '@/components/Stars';

import { Loader } from '@/components/ui/Loader';
import RegisterContent from '@/components/RegisterForm';

const page = () => {
  const {  isDarkMode } = useAppContext();

  
  

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 " : "bg-pur"} flex items-center justify-center text-white`}>
      <Stars />
      <Suspense fallback={<Loader />}>
        <RegisterContent />
      </Suspense>
    </div>
  );
};

export default page;

