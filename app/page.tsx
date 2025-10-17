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
    <section className={`${isDarkMode ? 'main-bg' : 'bg-pure'} transition-colors duration-600 min-h-screen w-screen h-full relative flex flex-col dark:main-bg z-10 scroll-smooth`}>
      <Stars count={80} />
      <ChatWidget />
      <div className='flex flex-col justify-center items-center pt-[280px] relative'>
        <h2 className={`isDarkMode ? "" : "" text-3xl font-bold text-white`}>AKIRA:</h2>
        <h1 className='text-7xl text-center font-bold mb-4 text-shimmer'>
          Your Personal AI Sales Manager.
        </h1>
        <p className={`${!isDarkMode && "text-white"} w-[750px] text-2xl text-center my-5`}>
          Akira is an intelligent, automated assistant that engages customers, proactively interacts with customers, and drives sales for your e-commerce business.
        </p>
        <div className="buttons">

        </div>

        <div className="bg-gray-600 w-[900px] h-[450px] rounded-xl shadow-md mt-5 overflow-hidden relative">
          <img src="/waitlist.png" alt="demo" className='w-fit object-cover' />
          <div className="overlay"></div>
        </div>
      </div>

      <div className="section-2 my-8 px-[200px] mt-[100px] relative">
        <h2 className={!isDarkMode ? 'gradient-text text-[45px] font-semibold mb-5' : 'text-[45px] font-semibold mb-5'}>Stop Losing Sales to Inefficiency.</h2>
        <p className='text-[#f2f1f8] w-[750px] text-2xl'>
          You have a great product, but managing every customer conversation, tracking every abandoned cart, and personalizing every interaction is impossible. The result? Frustrated customers and lost revenue. <br /> Akira solves this by giving you the power of an entire sales team in one AI-powered platform.
        </p>
      </div>

      <div className="features-section mt-[70px] px-[80px] pb-[50px] relative">
        <h1 className={`${!isDarkMode && "text-white"} text-4xl scale-y-100 font-bold tracking-wide`}>How Akira Works</h1>

        <div className='flex flex-wrap items-center w-full justify-between gap-5 mt-9'>

          <div className={`${!isDarkMode && 'text-white'} w-[300px] h-[320px] border rounded-md p-5  flex flex-col justify-center items-center gap-2 bg-gradient-to-br from-gray-900 to-indigo-600 relative shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out`}>
            <FaCommentDots className='mt-[20px] text-4xl absolute top-1 right-5' />
            <div>
              <h2 className='text-2xl font-semibold mb-5 pt-2'>Intelligent Q&A:</h2>
              <p className='text text-base'>Akira instantly answers customer questions about products, shipping, and returns, 24/7, so you never miss a sale.</p>
            </div>
          </div>

          <div className={`${!isDarkMode && 'text-white'} w-[300px] h-[320px] border rounded-md p-5  flex flex-col justify-center items-center gap-2 bg-gradient-to-br from-gray-900 to-indigo-600 relative shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out`}>
            <FaTag className='mt-[20px] text-4xl absolute top-0 right-5' />
            <div>
              <h2 className='text-2xl font-semibold mb-3'>Proactive Recommendation:</h2>
              <p className='text text-base'>
                Akira analyzes your product catalog and customer behavior to suggest personalized products, increasing your average order value with every conversation.
              </p>
            </div>
          </div>

          <div className={`${!isDarkMode && 'text-white'} w-[300px] h-[320px] border rounded-md p-5  flex flex-col justify-center items-center gap-2 bg-gradient-to-br from-gray-900 to-indigo-600 relative shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out`}>
            <div className=''>
              <FaShoppingCart className='text-4xl absolute top-4 right-5' />
              <h2 className='text-2xl font-semibold mb-3'>Cart Recovery:</h2>
              <p className='text text-base'>Akira automatically follows up with customers who leave items in their cart, giving them a gentle nudge and bringing them back to complete their purchase.</p>
            </div>

          </div>

          <div className={`${!isDarkMode && 'text-white'} w-[300px] h-[320px] border rounded-md p-5  flex flex-col justify-center items-center gap-2 bg-gradient-to-br from-gray-900 to-indigo-600 relative shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out`}>
            <FaLink className='text-4xl absolute top-4 right-5' />
            <div>
              <h2 className='text-2xl font-semibold mb-3'>Seamless Integration:</h2>
              <p className='text text-[18px] text-base'>Akira connects directly to your store, effortlessly syncing with your products, inventory, and order data to provide accurate, real-time information.</p>
            </div>
          </div>
        </div>
      </div>


      <div className="why-Akira px-[80px] pt-16 relative">

        <h2 className={`${!isDarkMode && 'text-white'} text-4xl font-bold`}>Future of Sales is Here. <br /> Why Choose Akira</h2>
        <p className={`${!isDarkMode && "text-white"} text-xl w-[800px] mt-4`}>
          Akira isn't just another chatbot. It's a proactive sales partner built to give you a competitive edge. Our AI doesn't just respond; it learns, adapts, and helps you sell. We empower store owners like you to scale their business with intelligent automation, without the overhead of hiring an entire sales team.
        </p>
        <ul className={`list-disc mt-4 pl-5 text-xl ${!isDarkMode && 'text-white'}`}>
          <li className='w-[600px]'>
            <span className='font-bold'>A Partner, Not a Tool:</span> Unlike generic chatbots, Akira actively learns from your data to provide personalized, human-like attention to every customer. It's like having a top-performing sales manager who can multitask and is available 24/7.
          </li>

          <li className='w-[600px] mt-5'>
            <span className='font-bold'>Designed for Growth:</span> Akira grows with you. Our tiered plans ensire you only pay for what you need, with features that unlock new revenue streams as your business expands.
          </li>

          <li className='w-[600px] mt-5'>
            <span className='font-bold'>Effortless Integration:</span> Go live in minutes. Our seamless, no-code setup means you can start recovering abandoned carts and engaging customers today.
          </li>
        </ul>
      </div>

      <div className="plans px-[80px] my-20 flex flex-col justify-center items-center w-full relative" id='pricings'>
        <h1 className={`${!isDarkMode && 'text-[#fff]'} text-4xl mb-5 font-bold`}>Start Driving Sales Today.</h1>
        <p className={`${!isDarkMode && "text-white"} text-xl text-center`}>Choose a plan that fits your business. <br /> Scale your AI as you grow.</p>

        <div className={`${!isDarkMode && "text-white"} pricings mt-9 flex justify-between w-[1100px] z-10`}>

          <div className="Free bg-gradient-to-br from-gray-900 to-indigo-600 w-[270px] p-5 rounded-md shadow hover:scale-[1.02] transition-all duration-300 ease-in-out">
            <h1 className='text-3xl font-semibold mb-2'>Plan: Free</h1>
            <h2 className='text-2xl mb-2'>Price: $0/month</h2>

            <h2 className=' text-[22px]'>Key Features:</h2>
            <ul className='list-disc pl-5 text-[19px] mt-1'>
              <li>500 monthly messages</li>
              <li>Unlimited conversations</li>
              <li>Instant customer Q&A</li>
              <li>Basic product Recommendations</li>
            </ul>
            <Button
              className='mt-4 align-middle bg-white! main-text font-bold text-xl px-[40px] cursor-pointer'
              onClick={() => start('free')}
            >
              Start Free Trial
            </Button>
          </div>

          <div className="Free bg-gradient-to-br from-gray-900 to-indigo-600 w-[370px] p-5 rounded-md shadow hover:scale-[1.02] transition-all duration-300 ease-in-out">
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
            <Button
              className='mt-4 align-middle bg-white! main-text font-bold text-xl px-[108px] cursor-pointer'
              onClick={() => start('growth')}
            >
              Get Started
            </Button>
          </div>

          <div className="Pro bg-gradient-to-br from-gray-900 to-indigo-600 w-[380px] p-5 rounded-md shadow hover:scale-[1.02] transition-all duration-300 ease-in-out">
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
            <Button
              className='mt-4 align-middle bg-white! main-text font-bold text-xl px-[113px] cursor-pointer'
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
