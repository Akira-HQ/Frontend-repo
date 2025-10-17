'use client'
import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'

const page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [emailCount, setEmailCount] = useState<number>(0)
  const [status, setStatus] = useState<boolean | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>("")

  const backend_url = 'https://akira-backend-g7qc.onrender.com/api/'

  const fetchWaitlist = async () => {
    if (!backend_url) {
      console.error("NEXT_PUBLIC_API_URL is not defined or incorrectly formatted.");
      setStatusMessage("Error: API URL is not configured.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const url = new URL('/api/waitlist/count', backend_url);
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEmailCount(data.count);
    } catch (error: any) {
      console.error("Error fetching waitlist count:", error);
      setStatusMessage("Failed to load waitlist count. Please check the API URL and server status.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("");

    if (!backend_url) {
      setStatusMessage("Error: API URL is not configured.");
      return;
    }

    try {
      const url = new URL('/api/waitlist', backend_url);
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        setStatus(false)
      }

      const data = await response.json();

      if (response.ok) {
        setStatusMessage("🎉 You've been added to the waitlist!");
        setEmail("");
        setStatus(true)
        fetchWaitlist(); // Re-fetch the count
      }
    } catch (error: any) {
      console.error("Error submitting email:", error);
      setStatusMessage(`Error: ${error.message}. Please check your backend server.`);
      setStatus(false)
    }
  };

  return (
    <section className='w-screen min-h-screen flex justify-center items-center bg-[#050211] overflow-hidden relative'>
      <div className='absolute inset-0'>
        <img src="/bg2.jpg" alt="background" className='w-full h-full object-cover' />
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      <div className="content relative z-20 flex flex-col justify-center items-center text-center my-10 px-4 max-w-lg mx-auto">
        <div className='flex flex-col justify-center items-center gap-5'>
          <h1 className='text-[#cdccd7] md:text-[#a399cc] text-3xl sm:text-4xl md:text-[47px] lg:text-6xl font-bold md:w-[720px] lg:w-[920px]'>Automate Your E-commerce. The Future of Business is Here.</h1>
          <p className='text-[#a69ec3]'>
            Join the waitlist for an AI Chatbot that increases Sales by 20-30%, operates 24/7, and launches soon.
          </p>
        </div>

        <div className="avatars flex justify-center items-center mt-6">
          <img src="/avatar1.png" alt="user1" className='w-10 h-10 rounded-full p-1 border border-[#5D3FD3] bg-[#050211]' />
          <img src="/avatar2.png" alt="user2" className='w-10 h-10 rounded-full p-1 border border-[#5D3FD3] ml-[-10px] bg-[#050211]' />
          <img src="/avatar3.png" alt="user3" className='w-10 h-10 rounded-full p-1 border border-[#5D3FD3] ml-[-10px] bg-[#050211]' />
          <img src="/avatar4.png" alt="user4" className='w-10 h-10 rounded-full p-1 border border-[#5D3FD3] ml-[-10px] bg-[#050211]' />
          <span className='w-10 h-10 flex items-center justify-center rounded-full p-1 border border-[#5D3FD3] bg-[#0c0623] text-green-300 ml-[-10px]'>{emailCount}</span>
        </div>

        <form onSubmit={handleSubmit} className='mt-6 w-full max-w-sm'>
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded bg-transparent border-2 border-[#5D3FD3] w-full h-12 px-4 placeholder:text-gray-400 text-white"
              placeholder="Enter your email address"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-[#5D3FD3] text-white rounded mt-4 w-full py-2 font-semibold tracking-wider transition-all duration-300 
                ${status === true ? 'bg-green-600' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4a32b0]'}`}
            >
              {status ? "You're in! We'll be in touch soon" : 'Join the Waitlist'}
            </button>
          </div>
        </form>

        <div className='mt-8 space-y-6 max-w-md'>
          <div className='text-[#a69ec3] flex items-start gap-4'>
            <FaCheck className='text-3xl min-w-[28px] mt-1' />
            <p className='text-left text-sm'>
              Akira connects to your e-commerce platform and uses AI to manage customers, automate tasks, and grow your business—all in one place.
            </p>
          </div>

          <div className='text-[#a69ec3] flex items-start gap-4'>
            <FaCheck className='text-3xl min-w-[28px] mt-1' />
            <p className='text-left text-sm'>
              Our platform uses AI to understand your customers and your inventory, giving you the power to automate customer service and sales, 24/7.
            </p>
          </div>

          <div className='text-[#a69ec3] flex items-start gap-4'>
            <FaCheck className='text-3xl min-w-[28px] mt-1' />
            <p className='text-left text-sm'>
              From personalized recommendations to automated support, Akira is the AI-powered nervous system your business needs to thrive. Get on the waitlist to be among the first to experience it.
            </p>
          </div>
        </div>
      </div>
    </section >
  )
}

export default page