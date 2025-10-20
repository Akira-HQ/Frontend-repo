'use client'
import React from 'react'
import { ButtonProps } from '@/types'


const Button = ({children, className, onClick, isDarkMode, type, disabled} : ButtonProps) => {
  return (
    <button type={type} onClick={onClick} className={`${className} ${isDarkMode ? "" : "bg-btn"} py-1 px-3 rounded shadow tracking-wide`}>
      {children}
    </button>
  )
}

export default Button
