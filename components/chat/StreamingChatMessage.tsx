"use client"

import { useState, useEffect, useRef } from "react"
import type { Message } from "@/lib/types"
import { HighlightedText } from "./HighlightedText"
import { User } from "lucide-react"
import { ChiRho } from "@/components/ChiRho"

interface StreamingChatMessageProps {
  message: Message
  searchQuery?: string
  isStreaming: boolean
  streamingContent: string
  username?: string
}

export const StreamingChatMessage = ({
  message,
  searchQuery,
  isStreaming,
  streamingContent,
  username = "Guest",
}: StreamingChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (messageRef.current) {
      setIsVisible(true)
      messageRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const displayContent = isStreaming ? streamingContent : message.content

  return (
    <div ref={messageRef} className={`p-4 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div className="flex items-start gap-3 max-w-[850px] mx-auto">
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#333]">
          {message.role === "user" ? (
            <User size={16} className="text-white" />
          ) : (
            <ChiRho size={20} className="text-[#e78e61]" />
          )}
        </div>
        <div className="flex-grow">
          <div className="font-medium text-sm mb-1">{message.role === "user" ? username : "ex314.ai"}</div>
          <div className="text-sm whitespace-pre-wrap">
            {searchQuery ? <HighlightedText text={displayContent} searchTerm={searchQuery} /> : displayContent}
            {isStreaming && <span className="animate-pulse">▋</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
