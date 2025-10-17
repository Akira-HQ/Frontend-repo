'use client'
import { useState, useEffect, useCallback } from "react"
import { UseResizableProps } from "@/types"


export const useResizable = ({initialWidth, minWidth = 200, maxWidth = 200} : UseResizableProps) => {
  const [width, setWidth] = useState(initialWidth)
  const [isResizing, setIsResizing] = useState(false)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = Math.max(minWidth, Math.min(e.clientX, maxWidth))
      setWidth(newWidth)
    }
  }, [isResizing, minWidth, maxWidth])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return { width, isResizing, setWidth, handleMouseDown }
}