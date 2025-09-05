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
    // Check if the API URL is configured before making the call
    if (!backend_url) {
      console.error("NEXT_PUBLIC_API_URL is not defined or incorrectly formatted.");
      setStatusMessage("Error: API URL is not configured.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Use URL constructor for a more robust and reliable way to build the URL
      const url = new URL('/api/waitlist/count', backend_url);
      const response = await fetch(url.toString());

      if (!response.ok) {
        // If the response is not OK, throw an error with the status
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
    <section className='w-screen h-screen flex justify-center items-center bg-[#050211]'>
      <div className='xl:h-screen xl:w-screen h-[500px] w-[500px] fixed mt-[290px]'>
        <img src="/bg2.jpg" alt="background" className='w-full h-full' />
        <div className="overlay"></div>
      </div>

      <div className="content xl:z-40 relative flex flex-col justify-center items-center text-center xl:w-screen xl:h-screen mt-[50px] xl:mt-[-180px] mx-3">
        <div className='xl:h-[500px] gap-5 flex flex-col justify-center items-center'>
          <h1 className='z-10 xl:text-[#8c77df] text-[#cdccd7] xl:text-6xl font-bold text-[23px] text-center'>Automate Your E-commerce. The Future of Business is Here.</h1>
          <p className='text-[#a69ec3]'>
            Join the waitlist for an AI Chatbot that increases Sales by 20-30%, operates 24/7, and launches soon.
          </p>
        </div>

        <div className="avatars flex justify-center items-center mt-3">
          <img src="/avatar1.png" alt="user1" className='w-[40px] h-[40px] rounded-full p-1 border bg-[#050211]' />
          <img src="/avatar2.png" alt="user2" className='w-[40px] h-[40px] rounded-full p-1 border ml-[-10px] bg-[#050211]' />
          <img src="/avatar3.png" alt="user3" className='w-[40px] h-[40px] rounded-full p-1 border bg-[#050211] ml-[-10px]' />
          <img src="/avatar4.png" alt="user4" className='w-[40px] h-[40px] rounded-full p-1 border bg-[#050211] ml-[-10px]' />
          <span className='w-[30px] h-[30px] rounded-full p-1 border bg-[#050211] text-center align-middle items-center text-green-300'>{emailCount}</span>
        </div>

        <form onSubmit={handleSubmit} className='mt-2'>
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
              className="rounded bg-transparent border-2 border-[#5D3FD3] w-[300px] h-10 pl-2 placeholder:text-gray-400 text-white"
              placeholder="Enter your email address"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-[#5D3FD3] text-white rounded mt-4 w-[300px] py-1 tracking-wider ${status === true ? 'text-green-500 border border-green-500' : 'text-red-500 '}`}
            >
              {status ? "You're in! We'll be in touch soon" : 'Join the Waitlist'}
            </button>
          </div>
        </form>



        <div className='mt-5 gap-2 flex flex-col'>
          <div className='text-[#a69ec3] flex justify-center items-start gap-3'>
            <FaCheck className='text-[34px]' />
            <p className='text-start text-[14px]'>
              Akira connects to your e-commerce platform and uses AI to manage customers, automate tasks, and grow your business—all in one place.
            </p>
          </div>

          <div className='text-[#a69ec3] flex justify-center items-start gap-3'>
            <FaCheck className='text-[34px]' />
            <p className='text-start text-[14px]'>
              Our platform uses AI to understand your customers and your inventory, giving you the power to automate customer service and sales, 24/7.
            </p>
          </div>

          <div className='text-[#a69ec3] flex justify-center items-start gap-3'>
            <FaCheck className='text-[34px]' />
            <p className='text-start text-[14px]'>
              From personalized recommendations to automated support, Akira is the AI-powered nervous system your business needs to thrive. Get on the waitlist to be among the first to experience it.
            </p>
          </div>
        </div>
      </div>
    </section >
  )
}

export default page
// c5bfda