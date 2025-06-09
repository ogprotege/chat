"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import type { Message } from "@/lib/types"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { trackChatFeature } from "@/lib/analytics/chat-analytics"
import type { MessageFilter } from "./ChatFilter"
import { useChat } from "@/context/ChatContext"
import { StreamingChatMessage } from "./StreamingChatMessage"
import { ChiRho } from "@/components/ChiRho"
import { getTimeBasedGreeting } from "@/utils/time-utils"
import { Disclaimer } from "./Disclaimer"
import { PenIcon, BookOpenIcon, BookIcon } from "lucide-react"

interface ChatViewProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (message: string) => void
  username?: string
  onInputFocus?: (focused: boolean) => void
}

export function ChatView({ messages, isLoading, onSendMessage, username = "Guest", onInputFocus }: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [currentResultIndex, setCurrentResultIndex] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filter, setFilter] = useState<MessageFilter>({ type: "all", preset: "all" })
  const [filteredMessages, setFilteredMessages] = useState<Message[]>(messages)
  const { currentModel } = useChat()
  const [showSearch, setShowSearch] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const [greeting, setGreeting] = useState(getTimeBasedGreeting())
  const [isInputFocused, setIsInputFocused] = useState(false)

  // Update greeting every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getTimeBasedGreeting())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Update filtered messages when messages change
  useEffect(() => {
    setFilteredMessages(messages)
  }, [messages])

  // Handle input focus change
  const handleInputFocus = (focused: boolean) => {
    setIsInputFocused(focused)
    if (onInputFocus) {
      onInputFocus(focused)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!isSearchOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isSearchOpen, filteredMessages])

  // Apply filters to messages
  useEffect(() => {
    let filtered = [...messages]

    // Filter by type
    if (filter.type && filter.type !== "all") {
      filtered = filtered.filter((message) => message.role === filter.type)
    }

    // Filter by date
    if (filter.dateRange) {
      const { from, to } = filter.dateRange

      if (from) {
        filtered = filtered.filter((message) => new Date(message.timestamp) >= from)
      }

      if (to) {
        // Add one day to include the entire "to" day
        const endDate = new Date(to)
        endDate.setDate(endDate.getDate() + 1)
        filtered = filtered.filter((message) => new Date(message.timestamp) < endDate)
      }
    }

    setFilteredMessages(filtered)

    // Reset search when filters change
    if (isSearchOpen && searchTerm) {
      // We need to manually perform search here to avoid dependency issues
      const results: number[] = []
      const lowerTerm = searchTerm.toLowerCase()

      filtered.forEach((message, index) => {
        if (message.content.toLowerCase().includes(lowerTerm)) {
          results.push(index)
        }
      })

      setSearchResults(results)
      setCurrentResultIndex(results.length > 0 ? 0 : -1)

      // Scroll to first result if available
      setTimeout(() => {
        if (results.length > 0) {
          const messageIndex = results[0]
          const messageElement = document.getElementById(`message-${messageIndex}`)
          messageElement?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)
    }
  }, [filter, messages, isSearchOpen, searchTerm])

  // Scroll to a specific message by ID
  const scrollToMessage = useCallback(
    (messageId: string) => {
      const messageElement = document.getElementById(messageId)
      if (messageElement && messagesContainerRef.current) {
        messageElement.scrollIntoView({ behavior: "smooth", block: "center" })

        // Add highlight effect
        messageElement.classList.add("highlight-search")
        setTimeout(() => {
          messageElement.classList.remove("highlight-search")
        }, 1500)
      }
    },
    [messagesContainerRef],
  )

  // Scroll to a specific search result
  const scrollToResult = useCallback(
    (resultIndex: number) => {
      const messageIndex = searchResults[resultIndex]
      const messageElement = document.getElementById(`message-${messageIndex}`)

      if (messageElement && messagesContainerRef.current) {
        const containerRect = messagesContainerRef.current.getBoundingClientRect()
        const messageRect = messageElement.getBoundingClientRect()

        const isInView = messageRect.top >= containerRect.top && messageRect.bottom <= containerRect.bottom

        if (!isInView) {
          messageElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }

        // Highlight the message
        messageElement.classList.add("highlight-search")
        setTimeout(() => {
          messageElement.classList.remove("highlight-search")
        }, 1500)
      }
    },
    [searchResults, messagesContainerRef],
  )

  // Perform search on filtered messages
  const performSearch = useCallback(
    (term: string, messagesToSearch = filteredMessages) => {
      if (!term.trim()) {
        setSearchResults([])
        setCurrentResultIndex(0)
        return
      }

      const results: number[] = []
      const lowerTerm = term.toLowerCase()

      messagesToSearch.forEach((message, index) => {
        if (message.content.toLowerCase().includes(lowerTerm)) {
          results.push(index)
        }
      })

      setSearchResults(results)
      setCurrentResultIndex(results.length > 0 ? 0 : -1)

      // Track search
      if (results.length > 0) {
        trackChatFeature("search_messages", {
          term,
          results_count: results.length,
        })
      }

      // Scroll to first result
      setTimeout(() => {
        if (results.length > 0) {
          scrollToResult(0)
        }
      }, 100)
    },
    [filteredMessages, scrollToResult],
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    performSearch(term)
  }

  // Navigate to next search result
  const goToNextResult = () => {
    if (searchResults.length === 0) return

    const nextIndex = (currentResultIndex + 1) % searchResults.length
    setCurrentResultIndex(nextIndex)
    scrollToResult(nextIndex)

    trackChatFeature("search_navigation", { direction: "next" })
  }

  // Navigate to previous search result
  const goToPrevResult = () => {
    if (searchResults.length === 0) return

    const prevIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length
    setCurrentResultIndex(prevIndex)
    scrollToResult(prevIndex)

    trackChatFeature("search_navigation", { direction: "previous" })
  }

  // Close search
  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchTerm("")
    setSearchResults([])
  }

  // Toggle filter panel
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
    if (isFilterOpen) {
      trackChatFeature("filter_close")
    } else {
      trackChatFeature("filter_open")
    }
  }

  // Debug logging
  useEffect(() => {
    console.log("Messages in ChatView:", messages)
    console.log("Filtered messages:", filteredMessages)
  }, [messages, filteredMessages])

  return (
    <div className="flex flex-col h-full">
      {/* Header with greeting */}
      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-3">
          <ChiRho size={24} className="text-[#e78e61]" />
          <h2 className="text-2xl font-serif text-[#e0e0e0]">
            {greeting}, {username}
          </h2>
        </div>
      </div>

      {/* Messages area - expanded to take more space */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[#1a1a1a]/30 mx-4 mb-4 rounded-lg"
        style={{ minHeight: "calc(100vh - 280px)" }}
      >
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              id={`message-${index}`}
              isHighlighted={index === searchResults[currentResultIndex] && searchResults.length > 0}
              searchTerm={searchTerm}
              username={username}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 py-8">No messages yet. Start a conversation!</div>
        )}

        {/* Show streaming message if loading */}
        {isLoading && (
          <StreamingChatMessage
            message={{
              id: "loading",
              role: "assistant",
              content: "Thinking...",
              timestamp: new Date().toISOString(),
            }}
            isStreaming={true}
            streamingContent={streamingContent || "Thinking..."}
            username={username}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer with input and disclaimer */}
      <div className="mt-auto">
        {/* Input area */}
        <div className="p-4">
          <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} onFocusChange={handleInputFocus} />
        </div>

        {/* Action buttons below the input */}
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
