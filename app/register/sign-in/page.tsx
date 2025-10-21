'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/components/AppContext'
import Button from '@/components/Button'
import { validatePassword } from '@/components/hooks/validatePassword'
import { UseAPI } from '@/components/hooks/UseAPI'

const page = () => {
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const { addToast, isDarkMode, setUser, user } = useAppContext()
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
  const { callApi } = UseAPI()

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    setPasswordErrors(validatePassword(event.target.value))
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!email || !password) {
        addToast("Fields cannot be empty!", 'error')
        return;
      }

      const response = await callApi("/user/login", 'POST', { email, password })

      setUser(response.data)
      addToast(response.message, 'success')
      localStorage.setItem('token', response.token)
      console.log("User data:", response.data)
      router.push('/dashboard?view=ai-training')
    } catch (error) {
      console.error("An error occured:", error)
      addToast("An error occured", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    // {/* Added p-4 for padding on mobile screens */}
    <div className={`${isDarkMode ? 'main-bg' : 'bg-pure'} w-screen h-screen overflow-hidden flex flex-col justify-center items-center p-4`}>

      {/* Replaced fixed w-[800px] with w-full and a max-w-md (448px) to constrain the container */}
      <div className={`w-full max-w-md flex flex-col justify-center items-center rounded-md py-3`}>
        {/* Added text-center and responsive text sizing */}
        <h1 className='text-3xl sm:text-4xl font-semibold tracking-wide text-white text-center'>
          Sign Into Your Account
        </h1>

        {/* Removed fixed w-[600px]. w-full makes it fill the parent (max-w-md) */}
        {/* Added px-6 sm:px-8 for horizontal padding inside the form */}
        <form onSubmit={handleSignIn} className={`${isDarkMode ? "bg-gray-900" : 'bg-pure'} shadow-2xl my-9 py-7 w-full overflow-hidden relative flex flex-col justify-center items-center px-6 sm:px-8`}>
          <div className={`${isDarkMode ? "bg-gray-900" : 'bg-pure'} w-full flex flex-col justify-center items-center`}>
            {/* Added w-full to labels to they fill the space */}
            <label className='flex flex-col w-full'>
              <span className='text-2xl text-white font-semibold'>Email</span>
              <input
                type="email"
                value={email === null ? "" : email.toString()}
                // {/* Replaced fixed w-[350px] with w-full */}
                className='w-full rounded-md bg-white h-8 mb-3 text-black px-2 outline-none'
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {/* Added w-full to labels to they fill the space */}
            <label className='flex flex-col w-full'>
              <span className='text-2xl text-white font-semibold'>Password</span>
              <input
                type="password"
                value={password === null ? "" : password.toString()}
                // {/* Replaced fixed w-[350px] with w-full */}
                className='w-full rounded-md bg-white h-8 mb-3 text-black px-2 outline-none'
                onChange={handlePasswordChange}
              />
            </label>
            {passwordErrors && (
              <div className='text-red-50 py-2 text-20px w-full'> {/* Added w-full */}
                {passwordErrors.capitalLetter && <div>• Password must contain a capital letter.</div>}
                {passwordErrors.number && <div>• Password must contain a number.</div>}
                {passwordErrors.minLength && <div>• Password must be at least 8 characters long.</div>}
                {passwordErrors.maxLength && <div>• Password must be no more than 24 characters long.</div>}
                {passwordErrors.specialChar && <div>• Password must contain a special character.</div>}
              </div>
            )}

            {/* Stack links on mobile, side-by-side on larger screens (sm:) */}
            <div className='mt-1 w-full text-xl text-white flex flex-col sm:flex-row sm:justify-between'>
              <p>Don't have an account? <a href="/register" className="underline">Sign Up</a></p>
              <a href="#" className="underline mt-2 sm:mt-0">Forgot Password?</a>
            </div>
            <Button type='submit' className={`mt-5 w-full mb-4 ${isDarkMode ? "" : "bg-[#8574c8]!"} text-xl font-bold tracking-wide`}>
              {loading ? "Signing..." : "Sign In"}
            </Button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default page