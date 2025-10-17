'use client'
import { ContextProps, Toast, User } from '@/types'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'


const AppContext = createContext<ContextProps | undefined>(undefined)

const getLocalStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error parsing localstorage "${key}":`, error)
      localStorage.removeItem(key)
      return null
    }
  }
  return null
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [alertMessage, setAlertMessageState] = useState<string>('')
  const [alertType, setAlertType] = useState<'success' | 'error' | 'loading' | null>(null)
  const [initialLoadCompleteInternal, setInitialLoadCompleteInternal] = useState(false)
  const [getStarted, setGetStarted] = useState<boolean>(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [user, setUserState] = useState<User | null>(null)

  const addToast = (message: string, type: "success" | "error" | 'info') => {
    if (toasts.length >= 3) {
      setToasts(prevToast => prevToast.slice(1))
    }

    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { id, message, type }
    setToasts(prevToasts => [...prevToasts, newToast])

    // setTimeout(() => removeToast(id), 5000)
  }

  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id))
  }

  const setAlertMessage = (message: string, type?: 'success' | 'error' | 'loading' | null) => {
    setAlertMessageState(message)
    setAlertType(type!)
    if (message) {
      if (type !== 'loading') {
        setTimeout(() => {
          setAlertMessageState('');
          setAlertType(null)
        }, 4000)
      }
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = getLocalStorageItem('theme')
      const storedStarted = getLocalStorageItem('started')
      const storedUser = getLocalStorageItem('user')

      if (storedTheme) setIsDarkMode(storedTheme)
      if (storedStarted) setGetStarted(storedStarted)
      if (storedUser) setUserState(storedUser)
      setInitialLoadCompleteInternal(true)
    }
  }, [])

  useEffect(() => {
    if (initialLoadCompleteInternal && typeof window !== 'undefined') {
      localStorage.setItem('theme', JSON.stringify(isDarkMode))
      localStorage.setItem('started', JSON.stringify(getStarted))
      localStorage.setItem('user', JSON.stringify(user))
    }
  }, [isDarkMode, getStarted, user])

  const contextValue = React.useMemo(() => ({
    isDarkMode, alertMessage, alertType, user, setUser: setUserState, setIsDarkMode, initialLoadComplete: initialLoadCompleteInternal, setAlertMessage, setAlertType, getStarted, setGetStarted, toasts, addToast, removeToast
  }), [isDarkMode, alertMessage, alertType, getStarted, toasts, addToast, removeToast, user, setUserState, setGetStarted, setIsDarkMode, setAlertMessage, setAlertType, initialLoadCompleteInternal])

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppcontext must be used within a AppProvider')
  }
  return context;
}