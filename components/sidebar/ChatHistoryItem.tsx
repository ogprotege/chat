"use client"

import { Star, Archive } from "lucide-react"
import { trackChatFeature } from "@/lib/analytics/chat-analytics"

interface ChatHistoryItemProps {
  title: string
  status: "active" | "starred" | "archived" | "deleted"
  active: boolean
  preview?: string
}

export function ChatHistoryItem({ title, status, active, preview }: ChatHistoryItemProps) {
  const handleClick = () => {
    trackChatFeature("select_chat", { title })
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left py-2 px-4 rounded-md text-sm flex items-center gap-2 transition-all duration-200 ${
        active
          ? "bg-[#333] text-white"
          : status === "archived"
            ? "bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-gray-300"
            : status === "starred"
              ? "text-white hover:bg-[#2a2a2a]"
              : "text-gray-custom hover:bg-[#2a2a2a] hover:text-white"
      }`}
    >
      {status === "archived" && <Archive size={14} className="text-gray-500 flex-shrink-0" />}
      {status === "starred" && <Star size={14} className="text-accent-gold flex-shrink-0" />}
      <div className="flex-1 overflow-hidden">
        <div className="truncate">{title}</div>
        {preview && <div className="text-xs text-gray-500 truncate">{preview}</div>}
      </div>
    </button>
  )
}
