'use client'
import React, { useState, useEffect } from 'react'
import { useAppContext } from '../AppContext'
import { BsCheckCircle, BsInfoCircle, BsXCircle, BsX } from 'react-icons/bs'

const ToastContainer = () => {
  const { toasts, removeToast } = useAppContext()
  const [isFading, setIsFading] = useState<string[]>([])

  useEffect(() => {
    toasts.forEach(toast => {
      if (!isFading.includes(toast.id)) {
        setTimeout(() => {
          setIsFading(prevIds => [...prevIds, toast.id]);
          setTimeout(() => {
            removeToast(toast.id)
          }, 500)
        }, 5000)
      }
    })
  }, [toasts])

  useEffect(() => {
    const toastsInContext = toasts.map(t => t.id);
    setIsFading(prevFading => prevFading.filter(id => toastsInContext.includes(id)))
  }, [toasts])

  const handleClose = (id: string) => {
    setIsFading(prev => [...prev, id])
    setTimeout(() => removeToast(id), 500)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <BsCheckCircle className='text-green-500' />
      case 'error': return <BsXCircle className='text-red-500' />
      case 'info': return <BsInfoCircle className='text-[#8574c8]' />
      default: return null
    }
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2'>
      {toasts.map(toast => (
        <div key={toast.id} className={`w-80 p-4 bg-white text-xl rounded-md shadow-lg flex items-center space-x-3 transform transition-all duration-300 animate-toast-in ${isFading.includes(toast.id) ? 'animate-toast-out' : ""}`}>
          {getIcon(toast.type)}
          <div className="flex-1 text-[19px] font-medium">{toast.message}</div>

          <button onClick={() => handleClose(toast.id)}><BsX size={24} /></button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
