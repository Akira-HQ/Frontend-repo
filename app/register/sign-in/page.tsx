'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/components/AppContext'
import Button from '@/components/Button'
import { validatePassword } from '@/components/hooks/validatePassword'

const page = () => {
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const { addToast, isDarkMode } = useAppContext()
  const router = useRouter()
  const [passwordErrors, setPasswordErrors] = useState({
    capitalLetter: false,
    number: false,
    minLength: false,
    maxLength: false,
    specialChar: false,
    hasLowercase: false
  });
  const [loading, setLoading] = useState<boolean>(false)

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    setPasswordErrors(validatePassword(event.target.value))
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email || !password) {
      addToast("Fields cannot be empty!", 'error')
      return;
    }
  }

  return (
    <div className={`${isDarkMode ? 'main-bg' : 'bg-pure'} w-screen h-screen overflow-hidden flex flex-col justify-center items-center`}>

      <div className={`${isDarkMode ? "" : ""} w-[800px] flex flex-col justify-center items-center rounded-md py-3`}>
        <h1 className='text-4xl font-semibold tracking-wide text-white'>Sign Into Your Account</h1>

        <form onSubmit={handleSignIn} className={`${isDarkMode ? "bg-gray-900" : 'bg-pure'} shadow-2xl my-9 py-7 w-[600px] overflow-hidden relative flex flex-col justify-center items-center`}>
          <div className={`${isDarkMode ? "bg-gray-900" : 'bg-pure'} flex flex-col justify-center items-center`}>
            <label className='flex flex-col'>
              <span className='text-2xl text-white font-semibold'>Email</span>
              <input
                type="email"
                value={email === null ? "" : email.toString()}
                className='w-[350px] rounded-md bg-white h-8 mb-3 text-black px-2 outline-none'
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className='flex flex-col'>
              <span className='text-2xl text-white font-semibold'>Name</span>
              <input
                type="password"
                value={password === null ? "" : password.toString()}
                className='w-[350px] rounded-md bg-white h-8 mb-3 text-black px-2 outline-none'
                onChange={handlePasswordChange}
              />
            </label>
            {passwordErrors && (
              <div className='text-red-50 py-2 text-20px'>
                {passwordErrors.capitalLetter && <div>• Password must contain a capital letter.</div>}
                {passwordErrors.number && <div>• Password must contain a number.</div>}
                {passwordErrors.minLength && <div>• Password must be at least 8 characters long.</div>}
                {passwordErrors.maxLength && <div>• Password must be no more than 24 characters long.</div>}
                {passwordErrors.specialChar && <div>• Password must contain a special character.</div>}
              </div>
            )}

            <div className='items-start mt-1 w-full text-xl text-white'>
              <p>Don't have an account? <a href="/register" className="underline">Sign Up</a></p>

              <a href="#" className="underline">Forgot Password?</a>
            </div>
            <Button type='submit' className={`mt-5 w-full mb-4 ${isDarkMode ? "" : "bg-[#8574c8]!"} text-xl font-bold tracking-wide`}>Sign In</Button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default page
