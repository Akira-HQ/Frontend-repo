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
