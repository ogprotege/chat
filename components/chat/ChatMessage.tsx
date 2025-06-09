"use client"

import type { Message } from "@/lib/types"
import { User } from "lucide-react"
import { ChiRho } from "@/components/ChiRho"

interface ChatMessageProps {
  message: Message
  id?: string
  searchTerm?: string
  isHighlighted?: boolean
  username?: string
}

export function ChatMessage({
  message,
  id,
  searchTerm = "",
  isHighlighted = false,
  username = "Guest",
}: ChatMessageProps) {
  // Function to highlight search terms in the message
  const highlightSearchTerm = (content: string, term: string) => {
    if (!term.trim()) return content

    const parts = content.split(new RegExp(`(${term})`, "gi"))

    return parts.map((part, i) => {
      if (part.toLowerCase() === term.toLowerCase()) {
        return (
          <mark key={i} className="bg-yellow-500/30 rounded px-0.5">
            {part}
          </mark>
        )
      }
      return part
    })
  }

  return (
    <div id={id} className={`p-4 ${isHighlighted ? "ring-2 ring-accent-purple" : ""}`}>
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
            {searchTerm ? highlightSearchTerm(message.content, searchTerm) : message.content}
          </div>
        </div>
      </div>
    </div>
  )
}
