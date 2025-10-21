'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '@/components/AppContext';
import { UseAPI } from '../../components/hooks/UseAPI';
import Button from '@/components/Button';
import Stars from '@/components/Stars';
import { FaShopify } from 'react-icons/fa';
import { validatePassword } from '@/components/hooks/validatePassword';
import { Loader } from '@/components/ui/Loader';
import RegisterContent from '@/components/RegisterForm';

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast, setUser, isDarkMode } = useAppContext();
  const { callApi } = UseAPI();

  const [nextStep, setNextStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({
    capitalLetter: true,
    number: true,
    minLength: true,
    maxLength: false,
    specialChar: true,
    hasLowercase: true
  });
  const [terms, setTerms] = useState(false);

  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');

  const selectedPlan = searchParams.get('plan') || 'free';

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordErrors(validatePassword(newPassword));
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (nextStep === 1) {
        if (!name || !email || !password || !confirmPassword) {
          addToast("All fields are required.", 'error');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          addToast("Passwords do not match.", 'error');
          setLoading(false);
          return;
        }
        const isPasswordStrong = Object.values(passwordErrors).every(value => value === false);

        if (!isPasswordStrong) {
          addToast("Please ensure your password meets all requirements.", 'error');
          setLoading(false);
          return;
        }

        if (!terms) {
          addToast("You must accept the Terms & Service.", 'error');
          setLoading(false);
          return;
        }

        const response = await callApi("/user/signup", 'POST', { name, email, password, plan: selectedPlan });

        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        setUser(response.data);
        addToast(response.message, 'success');
        setNextStep(2);
      }

      if (nextStep === 2) {
        if (!url || !platform) {
          addToast('You must select a platform and provide a URL.', 'error');
          setLoading(false);
          return;
        }

        const response = await callApi("/create-store", "POST", { url, platform });

        addToast(response.message, 'success');
        router.push(`/dashboard?view=ai-training`);
      }
    } catch (error: any) {
      addToast(error.message || 'An unexpected error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

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

