"use client"

import { useState, useMemo, useEffect } from "react"
import { useChat } from "@/context/ChatContext"
import { XIcon, Star, Archive, Search, Clock, Trash2, Calendar } from "lucide-react"
import type { JSX } from "react/jsx-runtime"
import { ChatActions } from "./ChatActions"

type Filter = "all" | "starred" | "archived" | "deleted"
type DateGroup = "today" | "yesterday" | "this_week" | "this_month" | "older"

interface GroupedChats {
  today: any[]
  yesterday: any[]
  this_week: any[]
  this_month: any[]
  older: any[]
}

export const ChatHistoryDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const { chats, selectChat, currentChatId, searchChatContent } = useChat()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<string[]>([]) // Store IDs of matching chats
  const [showDateGroups, setShowDateGroups] = useState(true)
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)

  // Reset search when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setSearch("")
      setIsSearching(false)
      setSearchResults([])
    }
  }, [isOpen])

  // Perform search when search term changes
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const results = searchChatContent(search)
    setSearchResults(results.map((chat) => chat.id))
  }, [search, searchChatContent])

  // Filter chats based on search and filter settings
  const filteredChats = useMemo(() => {
    // If searching, use search results
    if (isSearching && search.trim()) {
      return chats.filter((chat) => searchResults.includes(chat.id)).sort((a, b) => Number(b.id) - Number(a.id))
    }

    // Otherwise, filter by status
    const filtered =
      filter === "all"
        ? chats.filter((chat) => chat.status !== "deleted")
        : chats.filter((chat) => {
            if (filter === "starred") return chat.status === "starred"
            if (filter === "archived") return chat.status === "archived"
            if (filter === "deleted") return chat.status === "deleted"
            return true
          })

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => Number(b.id) - Number(a.id))
  }, [chats, search, filter, isSearching, searchResults])

  // Group chats by date
  const groupedChats = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const oneWeekAgo = new Date(today)
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const oneMonthAgo = new Date(today)
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    const groups: GroupedChats = {
      today: [],
      yesterday: [],
      this_week: [],
      this_month: [],
      older: [],
    }

    filteredChats.forEach((chat) => {
      const chatDate = new Date(Number(chat.id))

      if (chatDate >= today) {
        groups.today.push(chat)
      } else if (chatDate >= yesterday) {
        groups.yesterday.push(chat)
      } else if (chatDate >= oneWeekAgo) {
        groups.this_week.push(chat)
      } else if (chatDate >= oneMonthAgo) {
        groups.this_month.push(chat)
      } else {
        groups.older.push(chat)
      }
    })

    return groups
  }, [filteredChats])

  // Get chat preview text
  const getChatPreview = (chatId: string): string => {
    if (typeof window === "undefined") return ""

    const history = localStorage.getItem(`chat_history_${chatId}`)
    if (!history) return "No messages yet..."

    try {
      const messages = JSON.parse(history)
      if (messages && messages.length > 0) {
        const firstMessage = messages[0]
        const content = firstMessage.content || ""
        return content.length > 64 ? content.slice(0, 64) + "..." : content
      }
      return "Empty chat"
    } catch (e) {
      return "Unable to retrieve messages"
    }
  }

  // Get formatted date
  const getFormattedDate = (timestamp: string) => {
    const date = new Date(Number(timestamp))
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === now.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  // Determine if a chat is the current chat
  const isCurrentChat = (chatId: string) => {
    return chatId === currentChatId
  }

  // Get highlighted preview with search term
  const getHighlightedPreview = (chatId: string, preview: string | undefined): JSX.Element => {
    if (!search.trim() || !isSearching) {
      return <span>{preview || getChatPreview(chatId)}</span>
    }

    const previewText = preview || getChatPreview(chatId)
    const searchLower = search.toLowerCase()

    // If the preview doesn't contain the search term, try to find a matching message
    if (!previewText.toLowerCase().includes(searchLower)) {
      try {
        const history = localStorage.getItem(`chat_history_${chatId}`)
        if (history) {
          const messages = JSON.parse(history)
          for (const message of messages) {
            if (message.content.toLowerCase().includes(searchLower)) {
              // Find the context around the match
              const index = message.content.toLowerCase().indexOf(searchLower)
              const start = Math.max(0, index - 30)
              const end = Math.min(message.content.length, index + search.length + 30)
              let contextText = message.content.substring(start, end)

              // Add ellipsis if we're not showing the beginning or end
              if (start > 0) contextText = "..." + contextText
              if (end < message.content.length) contextText = contextText + "..."

              // Highlight the search term
              const parts = contextText.split(new RegExp(`(${search})`, "i"))
              return (
                <span>
                  {parts.map((part, i) =>
                    part.toLowerCase() === search.toLowerCase() ? (
                      <span key={i} className="bg-accent-purple/30 text-white">
                        {part}
                      </span>
                    ) : (
                      part
                    ),
                  )}
                </span>
              )
            }
          }
        }
      } catch (e) {
        console.error("Error parsing chat history:", e)
      }
    }

    // Default to highlighting in the preview
    const parts = previewText.split(new RegExp(`(${search})`, "i"))
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === search.toLowerCase() ? (
            <span key={i} className="bg-accent-purple/30 text-white">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </span>
    )
  }

  // Get the appropriate highlight class based on chat status
  const getHighlightClass = (chat: any, isHovered: boolean) => {
    const isSelected = isCurrentChat(chat.id)

    if (chat.status === "deleted") {
      return isHovered || isSelected ? "border-l-2 border-l-[#c41e3a]" : "hover:border-l-2 hover:border-l-[#c41e3a]"
    } else if (chat.status === "archived") {
      return isHovered || isSelected ? "border-l-2 border-l-accent-gold" : "hover:border-l-2 hover:border-l-accent-gold"
    } else {
      return isHovered || isSelected
        ? "border-l-2 border-l-accent-purple"
        : "hover:border-l-2 hover:border-l-accent-purple"
    }
  }

  // Get background class based on chat status
  const getBackgroundClass = (chat: any, isHovered: boolean) => {
    const isSelected = isCurrentChat(chat.id)

    if (chat.status === "deleted") {
      return isHovered || isSelected ? "bg-[#2a1a1a]" : "bg-[#1a1a1a]"
    } else if (chat.status === "archived") {
      return isHovered || isSelected ? "bg-[#2a2a1a]" : "bg-[#1a1a1a]"
    } else {
      return isHovered || isSelected ? "bg-[#2a2a2a]" : "bg-card-bg"
    }
  }

  // Get glow effect class based on chat status
  const getGlowClass = (chat: any, isHovered: boolean) => {
    const isSelected = isCurrentChat(chat.id)

    if (!isHovered && !isSelected) return ""

    if (chat.status === "deleted") {
      return "shadow-[0_0_8px_rgba(196,30,58,0.3)]"
    } else if (chat.status === "archived") {
      return "shadow-[0_0_8px_rgba(240,185,11,0.3)]"
    } else {
      return "shadow-[0_0_8px_rgba(138,99,210,0.3)]"
    }
  }

  // Render a chat item
  const renderChatItem = (chat: any) => {
    const isHovered = hoveredChatId === chat.id
    const isSelected = isCurrentChat(chat.id)

    return (
      <div
        key={chat.id}
        onClick={() => {
          selectChat(chat.id)
          onClose()
        }}
        onMouseEnter={() => setHoveredChatId(chat.id)}
        onMouseLeave={() => setHoveredChatId(null)}
        className={`p-3 rounded border border-[#333] transition-all duration-300 cursor-pointer relative group ${getBackgroundClass(
          chat,
          isHovered || isSelected,
        )} ${getHighlightClass(chat, isHovered || isSelected)} ${getGlowClass(chat, isHovered || isSelected)} ${
          chat.status === "archived" ? "opacity-75 hover:opacity-90" : ""
        } ${isSelected ? "opacity-100" : ""}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {chat.status === "archived" && <Archive size={14} className="text-accent-gold flex-shrink-0 mt-0.5" />}
            {chat.status === "starred" && <Star size={14} className="text-accent-gold flex-shrink-0 mt-0.5" />}
            {chat.status === "deleted" && <Trash2 size={14} className="text-[#c41e3a] flex-shrink-0 mt-0.5" />}
            <h3
              className={`font-medium text-sm ${
                chat.status === "archived"
                  ? "text-gray-400"
                  : chat.status === "deleted"
                    ? "text-gray-400"
                    : "text-white"
              } ${chat.status === "starred" || isSelected ? "font-semibold" : ""}`}
            >
              {chat.title || "Untitled Chat"}
            </h3>
          </div>
          <span className="text-xs text-gray-custom">{getFormattedDate(chat.id)}</span>
        </div>
        <p
          className={`text-xs ${
            chat.status === "archived"
              ? "text-gray-500"
              : chat.status === "deleted"
                ? "text-gray-500"
                : "text-gray-custom"
          } mt-2 truncate pl-6`}
        >
          {getHighlightedPreview(chat.id, chat.preview)}
        </p>
        <ChatActions chatId={chat.id} status={chat.status} />
      </div>
    )
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full bg-dark-bg z-50 w-[75%] max-w-3xl border-l border-[#333] shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#444]">
          <h2 className="text-lg font-semibold text-white">Chat History</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDateGroups(!showDateGroups)}
              className={`p-1.5 rounded-md transition-colors ${showDateGroups ? "bg-accent-purple/20 text-accent-purple" : "text-gray-400 hover:text-white"}`}
              title={showDateGroups ? "Disable date grouping" : "Enable date grouping"}
            >
              <Calendar size={18} />
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
              <XIcon size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-[#444]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              placeholder="Search chat titles and content..."
              className="w-full p-2 pl-10 bg-input-bg border border-[#444] rounded text-sm text-white placeholder:text-gray-custom focus:border-accent-purple focus:shadow-[0_0_8px_rgba(138,99,210,0.3)] outline-none"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("")
                  setIsSearching(false)
                  setSearchResults([])
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <XIcon size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="p-4 border-b border-[#444] flex gap-2">
          {(["all", "starred", "archived", "deleted"] as Filter[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center gap-1.5 ${
                filter === key
                  ? "bg-accent-purple text-white"
                  : "bg-card-bg text-gray-custom hover:text-white hover:bg-[#333]"
              }`}
            >
              {key === "all" && <Clock size={14} />}
              {key === "starred" && <Star size={14} />}
              {key === "archived" && <Archive size={14} />}
              {key === "deleted" && <Trash2 size={14} />}
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto h-[calc(100vh-200px)] p-4 custom-scrollbar">
          {isSearching && search && (
            <div className="text-sm text-gray-400 mb-2">
              {filteredChats.length === 0
                ? "No results found"
                : `Found ${filteredChats.length} results for "${search}"`}
            </div>
          )}

          {filteredChats.length === 0 ? (
            <div className="text-gray-custom text-center p-4">
              {filter === "all"
                ? "No chats found. Start a new conversation!"
                : filter === "starred"
                  ? "No starred chats. Star important conversations to find them easily."
                  : filter === "archived"
                    ? "No archived chats. Archive chats you want to keep but don't need right now."
                    : "No deleted chats."}
            </div>
          ) : showDateGroups && !isSearching ? (
            // Grouped by date
            <div className="space-y-6">
              {/* Today */}
              {groupedChats.today.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-accent-purple mb-2 uppercase">Today</h3>
                  <div className="space-y-3">{groupedChats.today.map(renderChatItem)}</div>
                </div>
              )}

              {/* Yesterday */}
              {groupedChats.yesterday.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-accent-purple mb-2 uppercase">Yesterday</h3>
                  <div className="space-y-3">{groupedChats.yesterday.map(renderChatItem)}</div>
                </div>
              )}

              {/* This Week */}
              {groupedChats.this_week.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-accent-purple mb-2 uppercase">This Week</h3>
                  <div className="space-y-3">{groupedChats.this_week.map(renderChatItem)}</div>
                </div>
              )}

              {/* This Month */}
              {groupedChats.this_month.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-accent-purple mb-2 uppercase">This Month</h3>
                  <div className="space-y-3">{groupedChats.this_month.map(renderChatItem)}</div>
                </div>
              )}

              {/* Older */}
              {groupedChats.older.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-accent-purple mb-2 uppercase">Older</h3>
                  <div className="space-y-3">{groupedChats.older.map(renderChatItem)}</div>
                </div>
              )}
            </div>
          ) : (
            // Flat list (no grouping)
            <div className="space-y-3">{filteredChats.map(renderChatItem)}</div>
          )}
        </div>
      </div>
    </>
  )
}
