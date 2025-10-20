'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppContext } from '@/components/AppContext';
import { UseAPI } from '../../components/hooks/UseAPI';
import Button from '@/components/Button';
import Stars from '@/components/Stars';
import { FaShopify } from 'react-icons/fa';
import { validatePassword } from '@/components/hooks/validatePassword';

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
      <form onSubmit={handleRegistration} className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
        {nextStep === 1 && (
          <>
            <h1 className="text-3xl font-bold text-center">Create Your Akira Account</h1>
            <div>
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 mt-1 text-black rounded bg-white" />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mt-1 text-black rounded bg-white" />
            </div>
            <div>
              <label>Password</label>
              <input type="password" value={password} onChange={handlePasswordChange} className="w-full p-2 mt-1 text-black rounded bg-white" />
            </div>
            <div>
              <label>Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 mt-1 text-black rounded bg-white" />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" id="terms" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
                <label htmlFor="terms" className="ml-2">I accept the Terms & Service</label>
              </div>
              <a href="/register/sign-in" className='underline'>Sign In</a>
            </div>
            <Button type="submit" className="w-full font-semibold" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </>
        )}

        {nextStep === 2 && (
          <>
            <h1 className="text-3xl font-bold text-center">Connect Your Store</h1>
            <p className="text-center text-gray-400">For offline development, this will create a dummy store.</p>
            <div className="pt-4">
              <label>Select Platform</label>
              <div className="flex items-center justify-center gap-4 mt-2">
                <button type="button" onClick={() => setPlatform('shopify')} className={`p-4 border-2 rounded-lg shadow-2xl ${platform === 'shopify' ? 'border-indigo-500 bg-gray-700' : 'border-gray-600'}`}>
                  <FaShopify size={40} />
                </button>
              </div>
            </div>
            <div className="pt-4">
              <label>Store URL</label>
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="your-store.myshopify.com" className="w-full p-2 mt-1 text-black rounded bg-white" />
            </div>
            <Button type="submit" className="w-full font-semibold" disabled={loading}>
              {loading ? "Connecting..." : "Connect Store"}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default page;

