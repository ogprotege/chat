"use client"

import type React from "react"
import { PlusIcon, ArrowUpIcon, Sparkles, PenIcon, BookOpenIcon, BookIcon } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { ChiRho } from "@/components/ChiRho"
import { getTimeBasedGreeting } from "@/utils/time-utils"
import { Disclaimer } from "./Disclaimer"

interface InitialViewProps {
  onSendMessage: (message: string) => void
  username?: string
  onInputFocus?: (focused: boolean) => void
}

export const InitialView = ({ onSendMessage, username = "Guest", onInputFocus }: InitialViewProps) => {
  const [message, setMessage] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [greeting, setGreeting] = useState(getTimeBasedGreeting())

  // Update greeting every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (onInputFocus) {
      onInputFocus(true)
    }
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (document.activeElement !== textareaRef.current) {
        setIsFocused(false)
        if (onInputFocus) {
          onInputFocus(false)
        }
      }
    }, 100)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with greeting */}
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-3">
          <ChiRho size={24} className="text-[#e78e61]" />
          <h2 className="text-2xl font-serif text-[#e0e0e0]">
            {greeting}, {username}
          </h2>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Central content - only shown when not focused */}
        {!isFocused && (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-[850px] mx-auto text-center">
              <h3 className="text-xl text-gray-300 mb-6">How can I assist you today?</h3>
            </div>
          </div>
        )}

        {/* Empty space for chat content when focused */}
        {isFocused && (
          <div className="flex-1 bg-[#1a1a1a]/30 rounded-lg mx-4 mb-4 overflow-y-auto">
            {/* This will be where chat messages appear */}
          </div>
        )}
      </div>

      {/* Footer with input and disclaimer */}
      <div className="mt-auto">
        {/* Chat input */}
        <div className="p-4">
          <div className="w-full max-w-[850px] mx-auto">
            <div
              className={`bg-[#222] border ${isFocused ? "border-accent-purple" : "border-[#444]"} rounded-lg p-4 transition-all duration-200`}
            >
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="How can I help you today?"
                className="w-full bg-transparent border-none resize-none outline-none text-white placeholder-gray-500 min-h-[40px] transition-all duration-200 caret-accent-gold"
                rows={1}
              />

              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <button className="p-1.5 rounded transition-all duration-200 hover:bg-[#333] hover:shadow-[0_0_8px_rgba(138,99,210,0.5)] active:transform active:scale-95">
                    <PlusIcon size={16} className="text-gray-400" />
                  </button>
                  <button className="p-1.5 rounded transition-all duration-200 hover:bg-[#333] hover:shadow-[0_0_8px_rgba(138,99,210,0.5)] active:transform active:scale-95">
                    <Sparkles size={16} className="text-gray-400" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">ex314.ai</span>
                  <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className={`p-1.5 rounded transition-all duration-200 ${
                      message.trim()
                        ? "bg-[#c65d35] hover:bg-[#d46a3f] hover:shadow-[0_0_8px_rgba(198,93,53,0.6)] active:transform active:scale-95"
                        : "bg-[#333] cursor-not-allowed opacity-70"
                    }`}
                  >
                    <ArrowUpIcon size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons - always at the bottom, but change position based on focus state */}
        <div className="flex justify-center gap-4 mb-4">
          <ActionButton icon={<PenIcon size={15} />} label="Write" />
          <ActionButton icon={<BookOpenIcon size={15} />} label="Learn" />
          <ActionButton icon={<BookIcon size={15} />} label="Bible" />
        </div>

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  )
}

// Action button component
const ActionButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="action-btn bg-[#333] text-sm text-gray-300 px-6 py-1.5 rounded flex items-center gap-2 w-[160px] justify-center">
    {icon}
    <span>{label}</span>
  </button>
)
