"use client"
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { LucideIcon, User, Lock, Mail, Zap, CheckCircle, XCircle } from 'lucide-react';
import { InputField, PasswordRequirement } from '../functions/Helper';
import { useAppContext } from '../AppContext';
import { UseAPI } from '../hooks/UseAPI';
import { validatePassword } from '../hooks/validatePassword';
import { PrimaryButton } from '../Button';
import { AkiraStarsBackground } from '../Stars';
import { useRouter } from 'next/navigation';



const ForgotPasswordContent: React.FC = () => {
  const router = useRouter();
  const { setAlertMessage, addToast } = useAppContext();
  const { callApi } = UseAPI();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState(validatePassword(''));

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewPassword(value);
    setPasswordErrors(validatePassword(value));
  };

  const isPasswordStrong = useMemo(() => {
    return Object.values(passwordErrors).every(value => value === false);
  }, [passwordErrors]);


  // Step 1: Submit Email to get the reset link/code
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage("", null);
    setLoading(true);

    if (!email) {
      setAlertMessage("Please enter your email address.", 'error');
      setLoading(false);
      return;
    }

    try {
      setAlertMessage("Requesting password reset...", 'loading');
      addToast("Requesting password reset...", 'loading');
      const response = await callApi("/user/forgot-password", 'POST', { email });

      setAlertMessage(response.message, 'success');
      addToast(response.message, 'success');
      setStep(2); // Move to the code entry screen

    } catch (error: any) {
      addToast(error.message || "Failed to send reset link. Please try again.", "error");
      setAlertMessage(error.message || "Failed to send reset link. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit Code and New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage("", null);
    setLoading(true);

    if (!code || !newPassword || !confirmNewPassword) {
      setAlertMessage("Code and both password fields are required.", 'error');
      addToast("Code and both password fields are required.", 'error');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setAlertMessage("New passwords do not match.", 'error');
      addToast("New passwords do not match.", 'error');
      setLoading(false);
      return;
    }
    if (!isPasswordStrong) {
      setAlertMessage("New password does not meet security requirements.", 'error');
      addToast("New password does not meet security requirements.", 'error');
      setLoading(false);
      return;
    }

    try {
      setAlertMessage("Updating your password...", 'loading');
      addToast("Updating your password...", 'loading');
      // Backend route should ideally handle email, code, and new password
      const response = await callApi("/user/reset-password", 'POST', {
        email,
        code,
        password: newPassword
      });

      setAlertMessage(response.message, 'success');
      addToast(response.message, 'success');

      // Redirect to login page after successful reset
      setTimeout(() => {
        router.push('/register/sign-in');
      }, 1000);

    } catch (error: any) {
      setAlertMessage(error.message || "Failed to reset password. Check your code or try again.", "error");
      addToast(error.message || "Failed to reset password. Check your code or try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic ---

  const Step1Form = (
    <form onSubmit={handleRequestReset} className="space-y-6">
      <h1 className='text-3xl sm:text-4xl font-extrabold text-white text-center mb-4'>
        Forgot Password
      </h1>
      <p className="text-center text-gray-400 pb-4">
        Enter your account email and we'll send you a password reset code.
      </p>

      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={Mail}
        placeholder="user@example.com"
      />

      <PrimaryButton type='submit' className={`mt-5 w-full font-bold tracking-wide`} disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 animate-pulse" />
            <span>Sending Code...</span>
          </span>
        ) : "Send Reset Code"}
      </PrimaryButton>

      <p className="text-center text-gray-400 pt-2 text-sm">
        Remembered your password? <a href="/register/sign-in" className={`text-[#A500FF] font-semibold hover:underline transition duration-200`}>Sign In</a>
      </p>
    </form>
  );

  const Step2Form = (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <h1 className='text-3xl sm:text-4xl font-extrabold text-white text-center mb-4'>
        Reset Password
      </h1>
      <p className="text-center text-gray-400 pb-4">
        Enter the code sent to <span className="text-[#00A7FF] font-medium">{email}</span> and set your new password.
      </p>

      <InputField
        label="Verification Code"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        icon={Mail}
        placeholder="6-digit code"
      />

      <InputField
        label="New Password"
        type="password"
        value={newPassword}
        onChange={handlePasswordChange}
        icon={Lock}
        placeholder="Enter new password"
      />
      <InputField
        label="Confirm Password"
        type="password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        icon={Lock}
        placeholder="Confirm new password"
      />

      {newPassword.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-gray-800/70 border border-gray-700 shadow-inner">
          <h3 className="text-white text-md font-semibold mb-2">New Password Requirements:</h3>
          <ul className="grid grid-cols-2 gap-2">
            <PasswordRequirement text="Min 8 characters" passed={passwordErrors.minLength} />
            <PasswordRequirement text="Max 50 characters" passed={passwordErrors.maxLength} />
            <PasswordRequirement text="1 Capital Letter" passed={passwordErrors.capitalLetter} />
            <PasswordRequirement text="1 Lowercase Letter" passed={passwordErrors.hasLowercase} />
            <PasswordRequirement text="1 Number" passed={passwordErrors.number} />
            <PasswordRequirement text="1 Special Char" passed={passwordErrors.specialChar} />
          </ul>
        </div>
      )}

      <PrimaryButton type='submit' className={`mt-5 w-full font-bold tracking-wide`} disabled={loading || !isPasswordStrong || newPassword !== confirmNewPassword}>
        {loading ? (
          <span className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 animate-pulse" />
            <span>Resetting...</span>
          </span>
        ) : "Reset Password"}
      </PrimaryButton>

      <p className="text-center text-gray-400 pt-2 text-sm">
        <a href="#" onClick={() => setStep(1)} className={`text-[#A500FF] font-semibold hover:underline transition duration-200`}>Resend Code</a>
      </p>
    </form>
  );

  return (
    <div className="min-h-screen font-inter bg-[#050505] antialiased overflow-x-hidden relative flex items-center justify-center p-4">
      <AkiraStarsBackground density={200} />
      <div className="py-12 w-full max-w-xl relative z-10">
        <div className={`
                    w-full max-w-lg p-6 sm:p-8 space-y-6 
                    bg-gray-900/80 rounded-3xl 
                    border border-gray-800 backdrop-blur-md 
                    shadow-2xl shadow-purple-500/20 
                    mx-auto transition-all duration-500
                `}>
          {step === 1 ? Step1Form : Step2Form}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordContent;