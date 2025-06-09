"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, ChevronUp, ChevronDown } from "lucide-react"
import { trackChatFeature } from "@/lib/analytics/chat-analytics"
import type { Message } from "@/lib/types"

interface ChatSearchProps {
  messages: Message[]
  onClose: () => void
  onScrollToMessage: (messageId: string) => void
}

export function ChatSearch({ messages, onClose, onScrollToMessage }: ChatSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<{ messageId: string; index: number }[]>([])
  const [currentResultIndex, setCurrentResultIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus the input when the component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Search for messages when the search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([])
      setCurrentResultIndex(-1)
      return
    }

    const searchResults = messages
      .map((message, index) => {
        if (message.content.toLowerCase().includes(searchTerm.toLowerCase())) {
          return { messageId: message.id, index }
        }
        return null
      })
      .filter((result): result is { messageId: string; index: number } => result !== null)

    setResults(searchResults)
    setCurrentResultIndex(searchResults.length > 0 ? 0 : -1)

    // Track search analytics
    if (searchTerm.trim().length > 2) {
      trackChatFeature("message_search", {
        search_term: searchTerm,
        results_count: searchResults.length,
      })
    }
  }, [searchTerm, messages])

  // Navigate to the current result
  useEffect(() => {
    if (currentResultIndex >= 0 && results.length > 0) {
      const currentResult = results[currentResultIndex]
      onScrollToMessage(currentResult.messageId)
    }
  }, [currentResultIndex, results, onScrollToMessage])

  const handlePrevResult = () => {
    if (results.length === 0) return
    setCurrentResultIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1))
  }

  const handleNextResult = () => {
    if (results.length === 0) return
    setCurrentResultIndex((prev) => (prev >= results.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-10 bg-card-bg border-b border-[#444] p-2">
      <div className="flex items-center">
        <Search className="h-4 w-4 text-gray-400 ml-2" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search in conversation..."
          className="flex-grow bg-transparent border-none text-white text-sm px-3 py-1.5 focus:outline-none"
        />
        {results.length > 0 && (
          <div className="flex items-center gap-1 px-2 text-xs text-gray-400">
            <span>
              {currentResultIndex + 1} of {results.length}
            </span>
            <button
              onClick={handlePrevResult}
              className="p-1 hover:bg-input-bg rounded-full"
              aria-label="Previous result"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button onClick={handleNextResult} className="p-1 hover:bg-input-bg rounded-full" aria-label="Next result">
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
        <button
          onClick={onClose}
          className="p-1 hover:bg-input-bg rounded-full text-gray-400"
          aria-label="Close search"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
