'use client'
import Button from '@/components/Button'
import { validatePassword } from '@/components/hooks/validatePassword'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAppContext } from '@/components/AppContext'
import Stars from '@/components/Stars'
import { FaAmazon, FaShopify } from 'react-icons/fa'

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState({
    capitalLetter: false,
    number: false,
    minLength: false,
    maxLength: false,
    specialChar: false,
    hasLowercase: false
  });
  const [error, setError] = useState<string>('');
  const { isDarkMode, setAlertMessage, alertMessage, addToast, setUser, user } = useAppContext();
  const [nextStep, setNextStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [platform, setPlatform] = useState<string>('');
  const [url, setUrl] = useState<string | null>(null)
  const [terms, setTerms] = useState<boolean>(false)

  useEffect(() => {
    const plan = searchParams.get('plan')
    if (plan) {
      setSelectedPlan(plan)
    }
  }, [searchParams])

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    setPasswordErrors(validatePassword(event.target.value))
  }

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (password !== confirmPassword) {
        setError('Password doesn\'t match')
        addToast("Password doesn't match", 'error')
        return
      }

      console.log(`User registered with plan: ${selectedPlan}`)

      if (nextStep === 1) {
        if (!name || !email || !password || !confirmPassword) {
          addToast('Fields can\'t be left empty', 'error');
          return;
        }
        if (!terms) {
          addToast('Terms and condition', 'error');
          return;
        }
        setUser({
          id: Math.random() * 2 + 5,
          name: name,
          email: email,
          password: password
        })
        console.log(user)
        addToast('Successfully created.', 'success')
        setNextStep(2)
      }

      if (nextStep === 2) {
        if (!url) {
          addToast('Must provide a url', 'error')
          return;
        }
        router.push(`/dashboard?view=ai-training`)
      }
    } catch (error) {
      console.error('An error occured:', error)
      setAlertMessage('Unable to connect', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${isDarkMode ? 'main-bg' : "bg-pure"} tranisition-color duration-600 overflow-y-hidden h-screen w-screen pt-10 flex justify-center items-center flex-col relative z-10`}>
      <Stars />
      <div className={`${isDarkMode ? "" : ""} w-[800px] flex flex-col justify-center items-center rounded-md py-3`}>
        <h1 className={`font-bold text-5xl ${isDarkMode ? "main-text" : "text-white"}`}>Register for Akira</h1>
        {selectedPlan && <p className='text-xl mt-3 text-white'>You have selected the {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan.</p>}
        <div className='flex gap-3 justify-between items-center mt-4'>
          <div className={`h-2 rounded-2xl w-[120px] bg-white ${nextStep === 1 || nextStep === 2 ? "bg-btn" : "bg-white"}`}></div>
          <div className={`h-2 rounded-2xl w-[120px] ${nextStep === 2 ? "bg-btn" : "bg-white"}`}></div>
        </div>

        <form onSubmit={handleRegistration} className={`my-9 w-[800px] h-[400px] overflow-hidden relative flex flex-col justify-center items-center`}>
          <div className='w-[650px] top-0 h-full absolute overflow-hidden '>
            <div className={`bar1 absolute ${isDarkMode ? "bg-gray-900" : "bg-pure"}  overflow-hidden rounded-md p-5 px-8 flex flex-col justify-center w-[600px] z-10 mb-6 transition-transform duration-500 ease-in-out ${nextStep === 1 ? 'translate-x-6 shadow-2xl' : "-translate-x-full"}`}>

              <div className='flex justify-between gap-8'>
                <label className='flex flex-col'>
                  <span className='text-2xl text-white font-semibold'>Name</span>
                  <input
                    type="text"

                    value={name === null ? "" : name.toString()}
                    className='w-[250px] rounded-md bg-white h-8 mb-3 text-black px-2 outline-none'
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>

                <label>
                  <span className='text-2xl text-white font-semibold'>Email</span>
                  <input
                    type="email"

                    value={email === null ? "" : email.toString()}
                    className='w-[250px] rounded-md bg-white h-8 mb-5 text-black px-2 outline-none'
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
              </div>

              <div className='flex justify-between gap-8'>
                <label className='flex flex-col'>
                  <span className='text-2xl text-white font-semibold'>Password</span>
                  <input
                    type="password"

                    value={password === null ? "" : password.toString()}
                    className='w-[250px] rounded-md bg-white h-8  text-black px-2 outline-none'
                    onChange={handlePasswordChange}
                  />
                </label>

                <label>
                  <span className='text-2xl text-white font-semibold'>Confirm Password</span>
                  <input
                    type="password"
                    value={confirmPassword === null ? "" : confirmPassword.toString()}
                    className='w-[250px] rounded-md bg-white h-8  text-black px-2 outline-none'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
              </div>

              {error && <p className='text-white text-xl py-3'>{error}</p>}
              {passwordErrors && (
                <div className='text-red-50 py-4 text-19px'>
                  {passwordErrors.capitalLetter && <div>• Password must contain a capital letter.</div>}
                  {passwordErrors.number && <div>• Password must contain a number.</div>}
                  {passwordErrors.minLength && <div>• Password must be at least 8 characters long.</div>}
                  {passwordErrors.maxLength && <div>• Password must be no more than 24 characters long.</div>}
                  {passwordErrors.specialChar && <div>• Password must contain a special character.</div>}
                </div>
              )}


              <p className='mb-2 flex gap-3 text-white text-xl text-left'>
                Have an account already?
                <a href="/register/sign-in" className='underline'>Sign In</a>
              </p>

              <label className='text-xl text-white'>
                <input type="checkbox" className='w-[15px] h-[15px]' onClick={() => setTerms(true)} />
                <a href="#" className="underline pl-2">Accept Terms & Service</a>
              </label>

              <Button type='submit' className={`${isDarkMode ? "bg-white! main-text" : "bg-white! text-[#8574c8]!"} font-semibold text-2xl shadow-md tracking-wide mt-5 cursor-pointer`}>{loading ? "Creating Account..." : "Create Your Account"}</Button>
            </div>


            <div className={`bar2 ${isDarkMode ? "bg-gray-900" : "bg-pure"}  overflow-hidden rounded-md p-5 px-8 flex flex-col justify-center w-[550px] items-center transition-transform duration-500 ease-in-out ${nextStep === 2 ? 'translate-x-12 shadow-2xl' : "translate-x-[150%] "}`}>
              <div className='flex flex-col w-full justify-center relative items-center text-white'>
                <h1 className='text-3xl'>Let's Connect Your Store</h1>
                <p className='text-xl mt-3'>Select your e-commerce platform below to get started</p>

                <div className='flex gap-3 items-center justify-between mt-8'>
                  <div className={`flex justify-center items-center gap-2 ${isDarkMode ? "bg-btn" : "bg-[#8574c8]"} px-3 py-1 rounded-md cursor-pointer`} onClick={() => setPlatform('shopify')}>
                    <FaShopify className='text-3xl' />
                    <span className='text-2xl'>Shopify</span>
                  </div>

                  <div className='flex justify-center items-center gap-2 rounded-md border px-3 py-1 cursor-pointer' onClick={() => setPlatform('amazon')}>
                    <FaAmazon className='text-3xl' />
                    <span className='text-2xl'>Amazon</span>
                  </div>
                </div>
                <div className={`flex justify-center items-center ${isDarkMode ? 'bg-btn' : 'bg-[#8574c8]'} px-3 py-2 rounded-md mt-5 text-xl`}>
                  Other Platforms Coming Soon...
                </div>

                {platform === 'shopify' && (
                  <div className={`absolute top-0 right-0 left-0 h-[350px] pb-6 text-white ${isDarkMode ? "bg-gray-900" : "bg-pure"}`}>
                    <div className='flex flex-col justify-center items-center w-full text-white'>
                      <h1 className={`text-3xl font-semibold ${isDarkMode ? "" : "text-white"}`}>Connect to Shopify</h1>
                      <p className='text-xl mt-4'>Enter your Shopify store URL below. We'll securely direct you to authorize the connection.</p>

                      <input type="text" value={url === null ? "" : url.toString()} placeholder='https://www.google.com/search?q=akiraDemo.myshopify.com' className='bg-white outline-none text-black px-2 mt-8 rounded-md shadow-xl w-[350px] h-8' onChange={(e) => setUrl(e.target.value)} />

                      <Button className={`mt-5 px-4 py-1.5 text-xl mb-3 ${isDarkMode ? "bg-btn" : "bg-[#8574c8]! text-white"}`}>{loading ? "Connecting..." : "Connect Store"}</Button>
                    </div>
                  </div>
                )}

                {platform === 'amazon' && (
                  <div className={`absolute top-0 right-0 left-0 h-full text-white ${isDarkMode ? "bg-gray-900" : "bg-pure"}`}>
                    <div className='flex justify-center items-center'>
                      <h1 className='text-3xl'>Coming Soon...</h1>
                    </div>
                  </div>
                )}

              </div>


            </div>
          </div>


        </form>
      </div>
    </div>
  )
}

export default page
