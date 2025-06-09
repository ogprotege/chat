"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { PlusIcon, ArrowUpIcon, Sparkles } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  onFocusChange?: (focused: boolean) => void
}

export const ChatInput = ({ onSendMessage, isLoading = false, onFocusChange }: ChatInputProps) => {
  const [message, setMessage] = useState("")
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResizeTextarea = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
    }
  }

  useEffect(() => {
    setIsButtonDisabled(message.trim().length === 0 || isLoading)
    autoResizeTextarea()
  }, [message, isLoading])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!isButtonDisabled) {
        sendMessage()
      }
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    if (onFocusChange) {
      onFocusChange(true)
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (onFocusChange) {
      onFocusChange(false)
    }
  }

  const sendMessage = () => {
    const trimmed = message.trim()
    if (trimmed) {
      onSendMessage(trimmed)
      setMessage("")
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  return (
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
          className="w-full bg-transparent border-none resize-none outline-none text-white placeholder-gray-500 min-h-[40px] caret-accent-gold"
          rows={1}
          disabled={isLoading}
        />

        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-2">
            <button
              className="p-1.5 rounded hover:bg-[#333] transition-all duration-200 hover:shadow-[0_0_8px_rgba(138,99,210,0.5)] active:transform active:scale-95"
              disabled={isLoading}
              aria-label="Add attachment"
            >
              <PlusIcon size={16} className="text-gray-400 group-hover:text-white" />
            </button>
            <button
              className="p-1.5 rounded hover:bg-[#333] transition-all duration-200 hover:shadow-[0_0_8px_rgba(138,99,210,0.5)] active:transform active:scale-95"
              disabled={isLoading}
              aria-label="Use AI suggestions"
            >
              <Sparkles size={16} className="text-gray-400 group-hover:text-white" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">ex314.ai</span>
            <button
              onClick={sendMessage}
              disabled={isButtonDisabled}
              className={`p-1.5 rounded transition-all duration-200 ${
                !isButtonDisabled
                  ? "bg-[#c65d35] hover:bg-[#d46a3f] hover:shadow-[0_0_8px_rgba(198,93,53,0.6)] active:transform active:scale-95"
                  : "bg-[#333] cursor-not-allowed opacity-70"
              }`}
              aria-label="Send message"
            >
              <ArrowUpIcon size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
