'use client'
import Button from '@/components/Button';
import ChatWidget from '@/components/chatTools/ChatWidget';
import Stars from '@/components/Stars';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { FaComment, FaCommentDots, FaLink, FaShoppingCart, FaTag } from 'react-icons/fa';
import { useAppContext } from '@/components/AppContext';

export default function Home() {
  const { isDarkMode, setGetStarted, initialLoadComplete } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (initialLoadComplete) {
      setGetStarted(false)
    }
  }, [initialLoadComplete])

  const start = (plan: string) => {
    router.push(`/register?plan=${plan}`)
    setGetStarted(true)
  }

  return (
    // {/* Use min-h-screen to ensure it at least fills the viewport */}
    <section className={`${isDarkMode ? 'main-bg' : 'bg-pure'} transition-colors duration-600 min-h-screen w-screen h-full relative flex flex-col dark:main-bg z-10 scroll-smooth`}>
      <Stars count={80} />
      <ChatWidget />
      {/* - Reduced mobile padding-top (pt-48) from pt-[280px]
        - Added horizontal padding (px-6) for mobile
      */}
      <div className='flex flex-col justify-center items-center pt-48 md:pt-[280px] px-6 relative'>
        <h2 className={`isDarkMode ? "" : "" text-3xl font-bold text-white`}>AKIRA:</h2>
        {/* - Reduced text size on mobile (text-5xl)
        */}
        <h1 className='text-5xl md:text-7xl text-center font-bold mb-4 text-shimmer'>
          Your Personal AI Sales Manager.
        </h1>
        {/* - Replaced fixed-width (w-[750px]) with w-full and max-w-3xl
          - Reduced text size on mobile (text-lg)
        */}
        <p className={`${!isDarkMode && "text-white"} w-full max-w-3xl text-lg md:text-2xl text-center my-5`}>
          Akira is an intelligent, automated assistant that engages customers, proactively interacts with customers, and drives sales for your e-commerce business.
        </p>
        <div className="buttons">
          {/* ... */}
        </div>

        {/* - Replaced fixed-width (w-[900px]) with w-full and max-w-4xl
          - Replaced fixed-height (h-[450px]) with aspect-video for responsive scaling
        */}
        <div className="bg-gray-600 w-full max-w-4xl aspect-video rounded-xl shadow-md mt-5 overflow-hidden relative">
          <img src="/waitlist.png" alt="demo" className='w-full h-full object-cover' /> {/* Changed to w-full h-full */}
          <div className="overlay"></div>
        </div>
      </div>

      {/* - Replaced large horizontal padding (px-[200px]) with mobile (px-6) and large-screen (lg:px-[200px])
      */}
      <div className="section-2 my-8 px-6 lg:px-[200px] mt-[100px] relative">
        {/* - Reduced text size on mobile (text-3xl)
        */}
        <h2 className={!isDarkMode ? 'gradient-text text-3xl md:text-[45px] font-semibold mb-5' : 'text-3xl md:text-[45px] font-semibold mb-5'}>Stop Losing Sales to Inefficiency.</h2>
        {/* - Replaced fixed-width (w-[750px]) with w-full and max-w-3xl
          - Reduced text size on mobile (text-lg)
        */}
        <p className='text-[#f2f1f8] w-full max-w-3xl text-lg md:text-2xl'>
          You have a great product, but managing every customer conversation, tracking every abandoned cart, and personalizing every interaction is impossible. The result? Frustrated customers and lost revenue. <br /> Akira solves this by giving you the power of an entire sales team in one AI-powered platform.
        </p>
      </div>

      {/* - Replaced large padding (px-[80px]) with mobile (px-6) and large-screen (lg:px-[80px])
      */}
      <div className="features-section mt-[70px] px-6 lg:px-[80px] pb-[50px] relative">
        <h1 className={`${!isDarkMode && "text-white"} text-3xl md:text-4xl scale-y-100 font-bold tracking-wide`}>How Akira Works</h1>

        {/* - Swapped flex-wrap for a responsive grid.
          - Stacks to 1 column on mobile, 2 on medium, 4 on large.
        */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-9'>

          {/* Removed fixed-width (w-[300px]) and height (h-[320px]). Grid handles width, min-h sets height. */}
          <div className={`${!isDarkMode && 'text-white'} min-h-[320px] border rounded-md p-5  flex flex-col justify-center items-center gap-2 bg-gradient-to-br from-gray-900 to-indigo-600 relative shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out`}>
            <FaCommentDots className='mt-[20px] text-4xl absolute top-1 right-5' />
            <div>
              <h2 className='text-2xl font-semibold mb-5 pt-2'>Intelligent Q&A:</h2>
              <p className='text text-base'>Akira instantly answers customer questions about products, shipping, and returns, 24/7, so you never miss a sale.</p>
            </div>
          </div>

          <div className={`${!isDarkMode && 'text-white'} min-h-[320px] border rounded-md p-5  flex flex-col justify-center items-center gap-2 bg-gradient-to-br from-gray-900 to-indigo-600 relative shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out`}>
            <FaTag className='mt-[20px] text-4xl absolute top-0 right-5' />
            <div>
              <h2 className='text-2xl font-semibold mb-3'>Proactive Recommendation:</h2>
              <p className='text text-base'>
                Akira analyzes your product catalog and customer behavior to suggest personalized products, increasing your average order value with every conversation.
              </p>
            </div>
          </div>

          <div className={`${!isDarkMode && 'text-white'} min-h-[320px] border rounded-md p-5  flex flex-col justify-center items-center gap-2 bg-gradient-to-br from-gray-900 to-indigo-600 relative shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out`}>
            <div className=''>
              <FaShoppingCart className='text-4xl absolute top-4 right-5' />
              <h2 className='text-2xl font-semibold mb-3'>Cart Recovery:</h2>
              <p className='text text-base'>Akira automatically follows up with customers who leave items in their cart, giving them a gentle nudge and bringing them back to complete their purchase.</p>
            </div>
          </div>

          <div className={`${!isDarkMode && 'text-white'} min-h-[320px] border rounded-md p-5  flex flex-col justify-center items-center gap-2 bg-gradient-to-br from-gray-900 to-indigo-600 relative shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out`}>
            <FaLink className='text-4xl absolute top-4 right-5' />
            <div>
              <h2 className='text-2xl font-semibold mb-3'>Seamless Integration:</h2>
              <p className='text text-[18px] text-base'>Akira connects directly to your store, effortlessly syncing with your products, inventory, and order data to provide accurate, real-time information.</p>
            </div>
          </div>
        </div>
      </div>


      {/* - Replaced large padding (px-[80px]) with mobile (px-6) and large-screen (lg:px-[80px])
      */}
      <div className="why-Akira px-6 lg:px-[80px] pt-16 relative">
        <h2 className={`${!isDarkMode && 'text-white'} text-3xl md:text-4xl font-bold`}>Future of Sales is Here. <br /> Why Choose Akira</h2>
        {/* - Replaced fixed-width (w-[800px]) with w-full and max-w-4xl
          - Reduced text size on mobile (text-lg)
        */}
        <p className={`${!isDarkMode && "text-white"} text-lg md:text-xl w-full max-w-4xl mt-4`}>
          Akira isn't just another chatbot. It's a proactive sales partner built to give you a competitive edge. Our AI doesn't just respond; it learns, adapts, and helps you sell. We empower store owners like you to scale their business with intelligent automation, without the overhead of hiring an entire sales team.
        </p>
        <ul className={`list-disc mt-4 pl-5 text-lg md:text-xl ${!isDarkMode && 'text-white'}`}>
          {/* - Replaced fixed-width (w-[600px]) with w-full and max-w-2xl
          */}
          <li className='w-full max-w-2xl'>
            <span className='font-bold'>A Partner, Not a Tool:</span> Unlike generic chatbots, Akira actively learns from your data to provide personalized, human-like attention to every customer. It's like having a top-performing sales manager who can multitask and is available 24/7.
          </li>

          <li className='w-full max-w-2xl mt-5'>
            <span className='font-bold'>Designed for Growth:</span> Akira grows with you. Our tiered plans ensire you only pay for what you need, with features that unlock new revenue streams as your business expands.
          </li>

          <li className='w-full max-w-2xl mt-5'>
            <span className='font-bold'>Effortless Integration:</span> Go live in minutes. Our seamless, no-code setup means you can start recovering abandoned carts and engaging customers today.
          </li>
        </ul>
      </div>

      {/* - Replaced large padding (px-[80px]) with mobile (px-6) and large-screen (lg:px-[80px])
      */}
      <div className="plans px-6 lg:px-[80px] my-20 flex flex-col justify-center items-center w-full relative" id='pricings'>
        <h1 className={`${!isDarkMode && 'text-[#fff]'} text-3xl md:text-4xl mb-5 font-bold`}>Start Driving Sales Today.</h1>
        <p className={`${!isDarkMode && "text-white"} text-lg md:text-xl text-center`}>Choose a plan that fits your business. <br /> Scale your AI as you grow.</p>

        {/* - Changed flex container to stack on mobile (flex-col) and be a row on large screens (lg:flex-row)
          - Centered items on mobile (items-center)
          - Added a gap (gap-8)
          - Removed fixed-width (w-[1100px]) and let flexbox handle it
        */}
        <div className={`${!isDarkMode && "text-white"} pricings mt-9 flex flex-col lg:flex-row justify-between items-center lg:items-start w-full max-w-6xl gap-8 z-10`}>

          {/* - Cards are now w-full on mobile and have fixed widths only on large screens (lg:w-[...])
          */}
          <div className="Free bg-gradient-to-br from-gray-900 to-indigo-600 w-full lg:w-[270px] p-5 rounded-md shadow hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <h1 className='text-3xl font-semibold mb-2'>Plan: Free</h1>
            <h2 className='text-2xl mb-2'>Price: $0/month</h2>

            <h2 className=' text-[22px]'>Key Features:</h2>
            <ul className='list-disc pl-5 text-[19px] mt-1'>
              <li>500 monthly messages</li>
              <li>Unlimited conversations</li>
              <li>Instant customer Q&A</li>
              <li>Basic product Recommendations</li>
            </ul>
            {/* - Button is now w-full for a consistent look on mobile
            */}
            <Button
              className='mt-4 align-middle bg-white! main-text font-bold text-xl w-full cursor-pointer'
              onClick={() => start('free')}
            >
              Start Free Trial
            </Button>
          </div>

          <div className="Free bg-gradient-to-br from-gray-900 to-indigo-600 w-full lg:w-[370px] p-5 rounded-md shadow hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <h1 className='text-3xl font-semibold mb-2'>Plan: Growth</h1>
            <h2 className='text-2xl mb-2'>Price: $49/month</h2>

            <h2 className=' text-[22px]'>Key Features:</h2>
            <ul className='list-disc pl-5 text-[19px] mt-1'>
              <li>10,000 monthly messages</li>
              <li>Proactive Recommendations</li>
              <li>Automated Cart Recovery</li>
              <li>Comprehensive analytics dashboard</li>
              <li>Priority support</li>
            </ul>
            {/* - Button is now w-full
            */}
            <Button
              className='mt-4 align-middle bg-white! main-text font-bold text-xl w-full cursor-pointer'
              onClick={() => start('growth')}
            >
              Get Started
            </Button>
          </div>

          <div className="Pro bg-gradient-to-br from-gray-900 to-indigo-600 w-full lg:w-[380px] p-5 rounded-md shadow hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <h1 className='text-3xl font-semibold mb-2'>Plan: Pro</h1>
            <h2 className='text-2xl mb-2'>Price: $199/month</h2>

            <h2 className=' text-[22px]'>Key Features:</h2>
            <ul className='list-disc pl-5 text-[19px] mt-1'>
              <li>100,000 monthly messages</li>
              <li>All Growth features</li>
              <li>Custom API Integrations</li>
              <li>Voice chat capabilities (future feature)</li>
              <li>Dedicated account manager</li>
            </ul>
            {/* - Button is now w-full
            */}
            <Button
              className='mt-4 align-middle bg-white! main-text font-bold text-xl w-full cursor-pointer'
              onClick={() => start('pro')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}