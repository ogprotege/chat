"use client"

import { useEffect, useState } from "react"

interface LoadingIndicatorProps {
  model?: string
}

export const LoadingIndicator = ({ model }: LoadingIndicatorProps) => {
  const [dots, setDots] = useState(".")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "."
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center py-4">
      <div className="flex space-x-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" style={{ animationDelay: "300ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" style={{ animationDelay: "600ms" }}></div>
      </div>
      <div className="text-sm text-gray-custom">{model ? `${model} is thinking${dots}` : `Thinking${dots}`}</div>
    </div>
  )
}
