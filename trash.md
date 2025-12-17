<div className='flex flex-col justify-center items-center w-[400px]'>
              <div className='flex justify-between  w-full gap-5'>
                <label className='flex flex-col '>
                  <span className='text-2xl text-white font-semibold'>Fullname</span>
                  <input type="text" required className='w-[300px] rounded-md bg-white h-8 mb-5 text-black px-2 outline-none' onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label className='flex flex-col'>
                  <span className='text-2xl text-white font-semibold'>Email</span>
                  <input type="email" required className='w-[300px] rounded-md bg-white h-8 mb-5 text-black px-2 outline-none' onChange={(e) => setEmail(e.target.value)} />
                </label>
              </div>

              <div className="flex justify-center  w-full gap-5 mb-5 ml-5">
                <label className='flex flex-col'>
                  <span className='text-2xl text-white font-semibold'>Password</span>
                  <input type="password" required className='w-[300px] rounded-md bg-white h-8 text-black px-2 outline-none' onChange={handlePasswordChange} />

                </label>

                <label className="flex flex-col">
                  <span className='text-2xl text-white font-semibold'>Confirm Password</span>
                  <input type="password" required className='w-[300px] rounded-md bg-white h-8 text-black px-2 outline-none' onChange={handlePasswordChange} />
                </label>
              </div>
            </div>

// const NotificationItem = ({ notification, onDismiss }: { notification: Notification; onDismiss: (id: string) => void }) => {
// return (
// <div className={`w-fit rounded-lg shadow-md p-4 border border-gray-200 bg-[#0d0f12] transition-opacity duration-500 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
// <span className="text-green-600 bg-[#000] px-3 py-1 rounded-md">New</span>
// <div className="flex items-start gap-2 ">

// <div className="flex-shrink-0 mt-1">
// {getNotificationIcon(notification.type)}
// </div>

// <div className="flex-grow">
// <h3 className="font-semibold text-gray-800">
// {currentNotification.data.title}
// </h3>
// <p className="text-sm text-gray-600 mt-1"
// dangerouslySetInnerHTML={{
//               __html: currentNotification.data.message.replace('{value}', `<b>${(currentNotification.data as any).progress?.value || ''}</b>`)
//             }}
// />

// {currentNotification.type === 'USAGE_ALERT' && (
// <div className="mt-2">
// <div className="w-full bg-gray-200 rounded-full h-2">
// <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${currentNotification.data.progress.value}%` }}></div>
// </div>
// </div>
// )}

// {currentNotification.type === "SECURITY_TIP" && (
// <a href={notification.data.action.link}
// className="text-sm font-semibold text-blue-600 hover:underline mt-2 inline-block"
// >
// {currentNotification.data.action.text}
// </a>
// )}
// </div>

// <button className="text-gray-400 hover:text-gray-600 flex-shrink-0"
// onClick={() => { onDismiss(notification.id) }}
// >
// <IoClose className="h-5 w-5" />
// </button>
// </div>
// </div>
// )
// }


//create akira account
router.post(
  "/user/signup",
  checkSchema(signupValidatorSchema),
  async (request, response) => {
    const { email, password, name, plan } = request.body;
    const result = validationResult(request);
    const validatedEmail = emailValidator(email);
    const validatedPassword = passwordValidator(password);
    const insert_query =
      "INSERT INTO users (id, name, email, password, plan) VALUES ($1, $2, $3, $4, $5)";
    const filter_query = "SELECT email FROM users WHERE email = $1";
    const insert_confirmation_query =
      "INSERT INTO confirmation_tokens (id, user_id, otp, email_to_confirm, created_at, expires_at) VALUES ($1, $2, $3, $4, $5, $6)";
    const emailExists = await pool.query(filter_query, [email]);

    try {
      if (!result.isEmpty() || !validatedEmail) {
        return response.status(400).send({ message: "Invalid Credentials" });
      }

      if (emailExists.rows.length > 0) {
        return response.status(409).send({ message: "Email already exists" });
      }

      if (!name) {
        return response.status(400).send({ message: "Must provide name " });
      }

      if (!validatedPassword.valid) {
        return response.status(400).send({ error: validatedPassword.errors });
      }

      const newRequest = matchedData(request);
      newRequest.password = await hashPassword(password);
      const code = getConfirmationCode(newRequest.email);

      const userid = generateID(6);
      const subject = "Welcome! Confirm your account";
      const text = `Enter this code to confirm your account: ${code.otpCode}. This code expires in 2 minutes.`;
      const link = `https://akiraai.com/user?cc=${code.otpCode}`;
      const html = `<p>Click <a href="${link}">Here</a> to proceed to confirmation page </p>`;

      const mailSent = await sendMail(email, subject, text, html);

      if (!mailSent) {
        console.error("Failed to send confirmation email.");
      }
      const newUser = {
        id: userid,
        ...newRequest,
        plan: plan,
      };

      await pool.query(insert_query, [
        userid,
        newRequest.name,
        newRequest.email,
        newRequest.password,
        plan,
      ]);

      await pool.query(insert_confirmation_query, [
        code.otpId,
        userid,
        code.otpCode,
        code.email,
        code.expiresAt,
        code.createdAt,
      ]);

      const jsonToken = jwt.sign(
        {
          userID: user.id,
          email: user.email,
          plan: user.plan,
        },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
      );

      return response.status(201).send({
        message: "Account created. Check yout mail to confirm.",
        data: buildUserFeedback(newUser),
        token: jsonToken,
      });
    } catch (error) {
      console.error("An error occured", error);
      return response
        .status(500)
        .send({ message: "An error occured", error: error });
    }
  }
);




'use client'
import React, { useEffect, useState } from 'react'
import { useAppContext } from './AppContext'

const Stars = ({ count = 100 }) => {
  const [stars, setStars] = useState<React.JSX.Element[]>([])
  const {isDarkMode} = useAppContext()

  useEffect(() => {
    const starList = []
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 8 + 3;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const opacity = Math.random() * 0.4 + 0.1;

      starList.push(
        <div key={i} className={`absolute rounded-full bg-[#601EF9] transition-colors duration-500 `} style={{
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}%`,
          left: `${left}%`,
          opacity: opacity,
          boxShadow: `0 0 10px rgba(79, 79, 229, ${opacity * 2})`,
          filter: `blur(${Math.random() * 1 + 0.5}px)`,
          animation: `pulse ${Math.random() * 5 + 3}s infinite ease-in-out alternate`
        }}></div>
      )
    }

    setStars(starList)
  }, [count])

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {stars}
    </div>
  )
}

export default Stars



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


'use client'
import React, { useState, useEffect } from 'react'
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import Button from './Button'
import { usePathname, useRouter } from 'next/navigation';
import { useAppContext } from './AppContext';


const Header = () => {
  const router = useRouter()
  const { isDarkMode, setIsDarkMode, getStarted, initialLoadComplete } = useAppContext()
  const pathname = usePathname()

  return (
    <header className={`${isDarkMode ? 'bg-white/5' : "bg-pure border-[#601EF9] "} transition-colors duration-500 bg-white flex justify-between items-center px-5 py-1 border-white fixed top-0 right-0 left-0 backdrop-filter backdrop-blur-md z-50`}>
      <h1 className='main-text text-[36px] font-bold text-shimmer'>Akira AI</h1>

      {pathname === '/' && (
        <Button className='mr-14' onClick={() => router.push('/#pricings')}>Get Started</Button> 
      )}
      {/* {pathname !== '/' && (
        <input type="search" className='border border-white rounded-md mr-20 h-8 w-[250px]' placeholder='search...' />
      )} */}

      <div onClick={() => setIsDarkMode(!isDarkMode)} className='flex absolute right-5 top-5 text-3xl z-10'>
        {isDarkMode ? <BsMoonFill className='text-white' /> : <BsSunFill className='text-white' />}
      </div>
    </header>
  )
}

export default Header


// const HeroSection: React.FC<{ onCta: (plan: string) => void }> = ({ onCta }) => (
// //   <section className="container mx-auto px-4 text-center max-w-7xl pt-16 pb-20 md:pt-32 md:pb-36">
// //     <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
// //       AKIRA: Your Personal <span className={`${NEON_GRADIENT} bg-clip-text text-transparent`}>AI Sales Manager.</span>
// //     </h1>
// //     <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
// //       Akira is an intelligent, automated assistant that engages customers, proactively interacts with customers, and drives sales for your e-commerce business.
// //     </p>

// //     <div className="flex justify-center space-x-4 mb-20">
// //       <PrimaryButton onClick={() => onCta("Growth")}>
// //         Start Free Trial
// //       </PrimaryButton>
// //       <SecondaryButton onClick={() => onCta("See Plans")}>
// //         See Plans
// //       </SecondaryButton>
// //     </div>

// //     <div className="max-w-4xl mx-auto h-64 md:h-96 rounded-2xl bg-gray-900 border border-[#00A7FF]/30 flex items-center justify-center shadow-2xl shadow-[#A500FF]/20 overflow-hidden">
// //       <div className="text-xl text-gray-500">AI Dashboard / Demo Screenshot Placeholder</div>
// //     </div>
// //   </section>
// // );

// const CapabilityGrid: React.FC<{ capabilities: any[] }> = ({ capabilities }) => (
//   <section className="container mx-auto px-4 py-20 max-w-7xl">
//     <div className="text-center mb-16">
//       <h2 className="text-3xl md:text-4xl font-bold mb-4">Akira's Core Capabilities</h2>
//       <p className="text-lg text-gray-400 max-w-4xl mx-auto">Go beyond simple chat. Akira is a comprehensive AI sales engine built on real-time data and predictive modeling.</p>
//     </div>
//     <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
//       {capabilities.map((cap, index) => (
//         <div key={index} className="group p-6 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-[#00A7FF] hover:shadow-[0_0_15px_rgba(0,167,255,0.4)] transition duration-330">
//           <cap.icon className="w-8 h-8 text-[#A500FF] mb-3 group-hover:text-[#00A7FF]" />
//           <h3 className="text-lg font-semibold text-white">{cap.title}</h3>
//         </div>
//       ))}
//     </div>
//   </section>
// );














------------------------
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../AppContext";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { MdSupportAgent } from "react-icons/md";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaBrain } from "react-icons/fa";
import {
  IoBarChart,
  IoChatbubbleOutline,
  IoGitNetworkOutline,
  IoSettingsSharp,
} from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import Notify from "../notifications/Notify";
import notificationsData from "../../contract.json";
import { Notification } from "@/types";
import Link from "next/link";

// ⚡ Defined Neon Colors (Assuming these are available in your Tailwind config)
const NEON_PURPLE = "#A500FF";
const NEON_ORANGE = "#FFB300";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  width: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Sidebar = ({
  isCollapsed,
  onToggle,
  width,
  onMouseDown,
}: SidebarProps) => {
  const searchParams = useSearchParams();
  const { user, logout } = useAppContext();
  const initial = user?.name ? user?.name.charAt(0).toUpperCase() : "?";
  const [state, setState] = useState(0);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // --- EFFECTS FOR VIEW MANAGEMENT ---
  useEffect(() => {
    const currentView = searchParams.get("view");
    if (currentView) {
      setView(currentView);
    }
  }, [searchParams]);

  useEffect(() => {
    const currentView = searchParams.get("view");
    if (pathname === "/dashboard" && !currentView) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("view", "inbox");
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [pathname, searchParams, router]);

  useEffect(() => {
    const viewMap: { [key: string]: number } = {
      "ai-training": 1,
      inbox: 2,
      integrations: 3,
      analytics: 4,
      settings: 5,
      "help-center": 6,
    };
    setState(viewMap[view || ""] || 0);
  }, [view]);

  // --- NOTIFICATION LOGIC ---
  useEffect(() => {
    setAllNotifications(notificationsData as Notification[]);
  }, []);

  const unReadNotifications = useMemo(() => {
    return allNotifications.filter((n) => !n.read);
  }, [allNotifications]);

  const notificationToShow = unReadNotifications[currentIndex];

  const handleDismiss = (id: string) => {
    setAllNotifications((currentNotifications) =>
      currentNotifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setCurrentIndex(0);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, unReadNotifications.length - 1),
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const navigate = (id: number, view: string) => {
    router.push(`/dashboard?view=${view}`);
  };

  // --- NAVIGATION ITEM RENDER FUNCTION (Centralized Styling) ---
  const NavItemContent = ({ isActive, Icon, label }: { isActive: boolean, Icon: React.ElementType, label: string }) => (
    <div
      className={`rounded-lg py-2 px-3 flex gap-3 items-center cursor-pointer w-full transition-all duration-200 
          ${isActive ? "bg-[#181c21] shadow-inner shadow-black/30" : "bg-transparent hover:bg-gray-800/50"}`}
    >
      <Icon className={`text-xl flex-shrink-0 transition-colors duration-200 
          ${isActive ? `text-[${NEON_PURPLE}]` : `text-gray-400 group-hover:text-[${NEON_ORANGE}]`}`}
      />
      {!isCollapsed && <span className={`text-lg font-medium transition-colors duration-200 ${isActive ? `` : 'text-gray-400'}`}>{label}</span>}
    </div>
  );

  const NavItem = ({ id, viewName, Icon, label }: { id: number, viewName: string, Icon: React.ElementType, label: string }) => {
    const isActive = state === id;

    const content = <NavItemContent isActive={isActive} Icon={Icon} label={label} />;

    return (
      <div
        className="group"
        onClick={() => navigate(id, viewName)}
      >
        {isActive ? (
          // Gradient Border Wrapper
          <div className={`p-[1px] rounded-lg bg-gradient-to-r from-[${NEON_ORANGE}] to-[${NEON_PURPLE}] overflow-hidden transition-all duration-200`}>
            {content}
          </div>
        ) : (
          // Standard Item
          <div className="rounded-lg">
            {content}
          </div>
        )}
      </div>
    );
  };


  return (
    <div
      className={`sidebar backdrop-filter backdrop-blur-md bg-[#0d0f12] fixed left-0 top-0 bottom-0 pt-16 transition-all duration-300 ease-in-out border-r border-gray-800`}
      style={{ width: `${width}px` }}
    >
      <span
        className="p-0! absolute right-3 z-10 grid h-6 place-items-center  text-white shadow-2xl cursor-grab text-2xl transition-all duration-300 "
        onClick={onToggle}
        onMouseDown={onMouseDown}
      >
        {isCollapsed ? (
          <BiChevronRight className="mr-1" size={32} />
        ) : (
          <BiChevronLeft size={32} />
        )}
      </span>
      <div className="sidebar-content h-full overflow-y-auto p-4 pt-0 relative text-white">

        {/* User Profile/Store */}
        <div className="user flex justify-between items-center mt-3 gap-3">
          {isCollapsed && (
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white -ml-1.5">
              <span className="text-lg font-bold">{initial}</span>
            </div>
          )}
          {!isCollapsed && (
            <div className="w-full">
              <div className="flex w-full justify-between items-center">
                <h1
                  className="text-2xl font-semibold"
                >
                  {user?.name}
                </h1>
                <Link href={'/register/upgrade-plan'} className="text-green-500 bg-gray-900 px-3 py-0.5 rounded-full text-md font-medium border border-green-700/50 hover:bg-green-900/30 transition-colors duration-200">
                  {user?.plan || 'FREE'}
                </Link>
              </div>
              {user?.store ? (
                <a
                  href={
                    user.store.storeUrl.startsWith("http")
                      ? user.store.storeUrl
                      : `https://${user.store.storeUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pt-1 text-xs text-gray-400 hover:text-[#00A7FF] hover:underline truncate block"
                  title={user.store.storeName}
                >
                  {user.store.storeName}
                </a>
              ) : (
                <p className="pt-1 text-xs text-red-400">
                  No store connected
                </p>
              )}
            </div>
          )}
        </div>

        <hr className="border-gray-700 w-full mt-4" />

        {/* Main Navigation */}
        <div className="navigations mt-6 flex flex-col gap-1.5">
          <NavItem id={1} viewName="ai-training" Icon={FaBrain} label="AI Training Center" />
          <NavItem id={2} viewName="inbox" Icon={IoChatbubbleOutline} label="Inbox" />
          <NavItem id={3} viewName="integrations" Icon={IoGitNetworkOutline} label="Integrations" />
          <NavItem id={4} viewName="analytics" Icon={IoBarChart} label="Analytics" />
        </div>


        {/* Footer/Fixed Items */}
        <div className="others absolute right-4 left-4 bottom-4 pt-4 border-t border-gray-800">
          <div className="flex w-full flex-col gap-1.5">

            {/* Notifications */}
            <div className="rounded-md py-1 px-3 flex gap-3 items-center mb-1">
              {isCollapsed && (
                <div className="bg-[#181c21] p-2 rounded-md shadow-xl -ml-2 relative">
                  <FaBell className="text-xl" />
                  <span className="badge absolute -top-1 -right-1 flex justify-center items-center h-5 w-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                    {unReadNotifications.length}
                  </span>
                </div>
              )}
              {!isCollapsed && unReadNotifications.length > 0 && (
                <Notify
                  key={notificationToShow?.id}
                  notification={notificationToShow}
                  onDismiss={() => handleDismiss(notificationToShow.id)}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  currentIndex={currentIndex}
                  totalUnread={unReadNotifications.length}
                />
              )}
            </div>

            <NavItem id={5} viewName="settings" Icon={IoSettingsSharp} label="Settings" />
            <NavItem id={6} viewName="help-center" Icon={MdSupportAgent} label="Help Center" />

            {/* Logout Button */}
            <div
              className={`group rounded-lg py-2 px-3 flex gap-3 items-center cursor-pointer 
                transition-colors duration-200 text-gray-400 hover:bg-red-900/30 hover:text-red-400`}
              onClick={logout}
            >
              <FaArrowRightFromBracket className="text-xl flex-shrink-0 group-hover:text-red-400" />
              {!isCollapsed && <span className="text-lg font-medium transition-colors duration-200">Logout</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;














real original
---------------
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../AppContext";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { MdSupportAgent } from "react-icons/md";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaBrain } from "react-icons/fa";
import {
  IoBarChart,
  IoChatbubbleOutline,
  IoGitNetworkOutline,
  IoSettingsSharp,
} from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import Notify from "../notifications/Notify";
import notificationsData from "../../contract.json";
import { Notification } from "@/types";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  width: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Sidebar = ({
  isCollapsed,
  onToggle,
  width,
  onMouseDown,
}: SidebarProps) => {
  const searchParams = useSearchParams();
  const { isDarkMode, user, logout } = useAppContext();
  const initial = user?.name ? user?.name.charAt(0).toUpperCase() : "?";
  const [state, setState] = useState<number | null>(null);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const view = searchParams.get("view");
    if (view) {
      setView(view);
    }
  }, [searchParams]);

  useEffect(() => {
    const view = searchParams.get("view");
    if (pathname === "/dashboard" && !view) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("view", "inbox");
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [pathname, searchParams, router]);

  useEffect(() => {
    if (view === "inbox") {
      setState(2);
    } else if (view === "ai-training") {
      setState(1);
    } else if (view === "integrations") {
      setState(3);
    } else if (view === "analytics") {
      setState(4);
    } else if (view === "settings") {
      setState(5);
    } else if (view === "help-center") {
      setState(6);
    }
  }, [view]);

  useEffect(() => {
    setAllNotifications(notificationsData as Notification[]);
  }, []);

  const unReadNotifications = useMemo(() => {
    return allNotifications.filter((n) => !n.read);
  }, [allNotifications]);

  const notificationToShow = unReadNotifications[currentIndex];

  const handleDismiss = (id: string) => {
    setAllNotifications((currentNotifications) =>
      currentNotifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setCurrentIndex(0);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, unReadNotifications.length - 1),
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const navigate = (id: number, view: string) => {
    setState(id);
    router.push(`/dashboard?view=${view}`);
  };

  return (
    <div
      className={`sidebar backdrop-filter backdrop-blur-md bg-[#0d0f12]  fixed left-0 top-0 bottom-0 pt-16 transition-all duration-300 ease-in-out`}
      style={{ width: `${width}px` }}
    >
      <span
        className="p-0! absolute right-3 z-10 grid h-6 place-items-center  text-white shadow-2xl cursor-grab text-2xl transition-all duration-300 "
        onClick={onToggle}
        onMouseDown={onMouseDown}
      >
        {isCollapsed ? (
          <BiChevronRight className="mr-1" size={32} />
        ) : (
          <BiChevronLeft size={32} />
        )}
      </span>
      <div className="sidebar-content h-full overflow-hidden p-4 pt-6 relative">
        <div>
          <div className="user flex justify-between items-center mt-3 gap-3">
            {isCollapsed && (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white -ml-1.5">
                <span className="text-lg font-bold">{initial}</span>
              </div>
            )}
            {!isCollapsed && (
              <div className="w-full">
                <div className="flex w-full justify-between items-center">
                  <h1
                    className={`${isCollapsed ? "hidden" : "block"} transition-all duration-300 ease-out text-2xl`}
                  >
                    {user?.name}
                  </h1>
                  <span className="text-green-500 bg-gray-900 px-3 py-0.5 rounded-md">
                    {user?.plan}
                  </span>
                </div>
                {user?.store ? (
                  <a
                    href={
                      user.store.storeUrl.startsWith("http")
                        ? user.store.storeUrl
                        : `https://${user.store.storeUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-2 text-[15px] text-gray-400 hover:underline truncate block"
                    title={user.store.storeName}
                  >
                    {user.store.storeName}
                  </a>
                ) : (
                  <p className="pt-2 text-[15px] text-gray-500">
                    No store connected
                  </p>
                )}
              </div>
            )}
          </div>

          <hr className="border-gray-700 border w-full  mt-4" />

          <div className="navigations mt-5 flex flex-col gap-2">
            <div
              className={`${state === 1 ? "bg-[#181c21] shadow-xl " : "bg-transparent"} rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer`}
              onClick={() => navigate(1, "ai-training")}
            >
              <FaBrain className="text-xl" />
              {!isCollapsed && (
                <span className="text-xl">AI Training Center</span>
              )}
            </div>

            <div
              className={`${state === 2 ? "bg-[#181c21] shadow-xl " : "bg-transparent"} rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer`}
              onClick={() => navigate(2, "inbox")}
            >
              <IoChatbubbleOutline className="text-xl" />
              {!isCollapsed && <span className="text-xl">Inbox</span>}
            </div>

            <div
              className={`${state === 3 ? "bg-[#181c21] shadow-xl " : "bg-transparent"} rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer`}
              onClick={() => navigate(3, "integrations")}
            >
              <IoGitNetworkOutline className="text-xl" />
              {!isCollapsed && <span className="text-xl">Integrations</span>}
            </div>

            <div
              className={`${state === 4 ? "bg-[#181c21] shadow-xl " : "bg-transparent"} rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer`}
              onClick={() => navigate(4, "analytics")}
            >
              <IoBarChart className="text-xl" />
              {!isCollapsed && <span className="text-xl">Analytics</span>}
            </div>
          </div>
        </div>

        <div className="others fixed right-4 left-4 bottom-4">
          <div className="flex w-full flex-col gap-1">
            <div className="rounded-md py-1 px-2 flex gap-3 items-center mb-1">
              {isCollapsed && (
                <div className="bg-[#181c21] p-2 rounded-md shadow-xl -ml-2 relative">
                  <FaBell className="text-xl" />
                  <span className="badge absolute -top-1 -right-1 flex justify-center items-center h-5 w-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                    {unReadNotifications.length}
                  </span>
                </div>
              )}
              {!isCollapsed && unReadNotifications.length > 0 && (
                <Notify
                  key={notificationToShow?.id}
                  notification={notificationToShow}
                  onDismiss={() => handleDismiss(notificationToShow.id)}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  currentIndex={currentIndex}
                  totalUnread={unReadNotifications.length}
                />
              )}
            </div>

            <div
              className={`${state === 5 ? "bg-[#181c21] shadow-xl " : "bg-transparent"} rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer w-full`}
              onClick={() => navigate(5, "settings")}
            >
              <IoSettingsSharp className="text-xl" />
              {!isCollapsed && <span className="text-xl">Settings</span>}
            </div>

            <div
              className={`${state === 6 ? "bg-[#181c21] shadow-xl " : "bg-transparent"} rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer`}
              onClick={() => navigate(6, "help-center")}
            >
              <MdSupportAgent className="text-xl" />
              {!isCollapsed && <span className="text-xl">Help Center</span>}
            </div>

            <div
              className={`rounded-md py-1 px-2 flex gap-3 items-center cursor-pointer`}
              onClick={logout}
            >
              <FaArrowRightFromBracket className="text-xl" />
              {!isCollapsed && <span className="text-xl">Logout</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
