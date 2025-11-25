'use client'
import { ContextProps, Toast, User } from '@/types'
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const AppContext = createContext<ContextProps | undefined>(undefined)

const getLocalStorageItem = (key: string) => {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key)
      // Check if item is null or undefined before attempting to parse
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true)
  const [alertMessage, setAlertMessageState] = useState<string>('')
  const [alertType, setAlertType] = useState<'success' | 'error' | 'loading' | null>(null)
  const [initialLoadCompleteInternal, setInitialLoadCompleteInternal] = useState(false)
  const [getStarted, setGetStarted] = useState<boolean>(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [user, setUserState] = useState<User | null>(null)
  const router = useRouter()

  const addToast = (message: string, type: "success" | "error" | "loading" | "info") => {
    // If the maximum number of toasts is reached, remove the oldest one before adding a new one
    setToasts(prevToasts => {
      const updatedToasts = prevToasts.length >= 3 ? prevToasts.slice(1) : prevToasts;
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: Toast = { id, message, type }
      return [...updatedToasts, newToast];
    });
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

      // Use stored values, falling back to false/null if needed
      if (storedTheme !== null) setIsDarkMode(storedTheme)
      if (storedStarted !== null) setGetStarted(storedStarted)
      if (storedUser !== null) setUserState(storedUser)
      setInitialLoadCompleteInternal(true)
    }
  }, [])

  useEffect(() => {
    if (initialLoadCompleteInternal && typeof window !== 'undefined') {
      // Store raw values for efficiency, not JSON stringified booleans/null
      localStorage.setItem('theme', JSON.stringify(isDarkMode))
      localStorage.setItem('started', JSON.stringify(getStarted))
      localStorage.setItem('user', JSON.stringify(user)) // Ensure user object can be stringified
    }
  }, [isDarkMode, getStarted, user, initialLoadCompleteInternal])

  const logout = () => {
    setUserState(null)
    setAlertMessageState("")
    setAlertType(null)
    setToasts([])

    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('started')
    }
    router.push('/register/sign-in')
  }

  const contextValue = React.useMemo(() => ({
    isDarkMode, alertMessage, alertType, user, setUser: setUserState, setIsDarkMode, initialLoadComplete: initialLoadCompleteInternal, setAlertMessage, setAlertType, getStarted, setGetStarted, toasts, addToast, removeToast, logout
  }), [isDarkMode, alertMessage, alertType, getStarted, toasts, user, initialLoadCompleteInternal])

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