'use client'
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { BsSend, BsX } from 'react-icons/bs';
import Button from '../Button';
import { AkiraStarsBackground } from '../Stars';

interface Message {
  sender: 'Akira' | 'User';
  text: string;
}

interface Props {
  onClose: () => void;
}

const conversation: Message[] = [
  { sender: 'Akira', text: "Hello! Welcome to Akira. I'm a demo of an AI sales manager. How can I answer your questions about Akira today?" },
  { sender: "User", text: "Hi, how does Akira help with sales?" },
  { sender: 'Akira', text: "I help with sales by providing instant answers to customer questions, recommending personalized products, and automatically recovering abandoned carts. It's like having a full-time salesperson available 24/7." },
  { sender: 'User', text: "What  about the pricing? I saw a few plans." },
  { sender: "Akira", text: "We offer a Free plan to get you started, a Growth plan for scaling your business, and a Pro plan for high-volume stores. You can find all the details on our pricing page." },
  { sender: "User", text: "I'm a new store owner. Which plan is right for me?" },
  { sender: "Akira", text: "For new store owners, I'd highly recommend starting with the Free plan. It allows you to test out Akira's core features with no risk. You can always upgrade later!" },
  { sender: "User", text: "Thanks, that's really helpful!" },
  { sender: "Akira", text: "You're welcome! Feel free to ask if you have any other questions. I'm here to help." }
]

const ChatWindow = ({ onClose }: Props) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [isTyping, setIsTyping] = useState<boolean>(true)
  const messageEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([conversation[0]])
  }, [])

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim() === '' || currentStep >= conversation.length - 1) return

    const nextUserMessage = conversation[currentStep + 1];
    setMessages(prev => [...prev, {sender: 'User', text: inputMessage}])
    setInputMessage('')

    setTimeout(() => {
      setMessages(prev => [...prev, conversation[currentStep + 2]])
      setCurrentStep(prev => prev + 2)
    }, 1000)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className='w-80 h-[600px] bg-white dark:bg-black rounded-xl shadow-xl flex flex-col fixed bottom-24  right-6 transform scale-100 opacity-100 transition-all duration-300'>
      <div className='bg-indigo-600 text-white p-4 rounded-t-xl flex justify-between items-center'>
        <h3 className='font-bold text-2xl'>Akira AI</h3>
        <Button onClick={onClose}><BsX size={24} /></Button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto relative">
        <AkiraStarsBackground />
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'Akira' ? 'text-left' : 'text-right z-40'}`}>
            <span className={`inline-block p-2 rounded-lg max-w-[80%]  z-40 ${msg.sender === 'Akira' ? "bg-gray-200 text-black" : "bg-indigo-600 text-white"}`}>
              {msg.text}
            </span>
          </div>
        ))}
        {currentStep < conversation.length - 1 && conversation[currentStep + 1].sender === 'Akira' && (
          <div className='text-left animate-pulse'>
            <span className='inline-block p-2 rounded-lg bg-gray-200 text-black'>
              ...
            </span>
          </div>
        )}
        <div ref={messageEndRef}></div>
      </div>

      <div className="p-4 border-t border-gray-200 flex">
        <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder='Type a message...' className='w-full p-2 border border-gray-300 rounded-lg text-black dark:text-white px-2' />
        <Button onClick={handleSendMessage} className='ml-2 p-2 '><BsSend size={24} /></Button>
      </div>
    </div>
  )
}

export default ChatWindow
