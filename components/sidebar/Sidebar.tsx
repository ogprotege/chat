"use client"

import { useState } from "react"
import { PlusCircle, Menu, ChevronDown, ChevronRight, ChevronLeft, Star, Archive, Trash2 } from "lucide-react"
import { useChat } from "@/context/ChatContext"
import { ChiRho } from "@/components/ChiRho"
import { UserProfile } from "./UserProfile"
import { ChatHistoryDrawer } from "./ChatHistoryDrawer"
import { ChatActions } from "./ChatActions"

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const { newChat, chats, selectChat, currentChatId } = useChat()
  const [showAllRecents, setShowAllRecents] = useState(false)
  const [showAllArchived, setShowAllArchived] = useState(false)
  const [isArchivedHovered, setIsArchivedHovered] = useState(false)
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false)
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)

  // Filter chats by status
  const recentChats = chats
    .filter((chat) => chat.status === "active" || chat.status === "starred")
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 10)

  const archivedChats = chats.filter((chat) => chat.status === "archived").sort((a, b) => Number(b.id) - Number(a.id))

  // Handle toggle click
  const handleToggleClick = () => {
    onToggle()
  }

  // Get the appropriate highlight class based on chat status
  const getHighlightClass = (chat: any, isHovered: boolean) => {
    const isSelected = currentChatId === chat.id

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
    const isSelected = currentChatId === chat.id

    if (chat.status === "deleted") {
      return isHovered || isSelected ? "bg-[#2a1a1a]" : ""
    } else if (chat.status === "archived") {
      return isHovered || isSelected ? "bg-[#2a2a1a]" : ""
    } else {
      return isHovered || isSelected ? "bg-[#2a2a2a]" : ""
    }
  }

  return (
    <>
      <aside
        className={`${
          isCollapsed ? "w-[60px]" : "w-[256px]"
        } h-screen bg-[#1c1c1c] border-r border-[#333] flex flex-col transition-all duration-300`}
      >
        {/* Top section with logo and toggle button */}
        <div className="p-4 flex flex-col items-center">
          {!isCollapsed ? (
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center">
                <ChiRho size={24} className="mr-3" />
                <span className="text-lg font-medium">ex314</span>
              </div>
              <button
                onClick={handleToggleClick}
                className="p-1 rounded-md hover:bg-[#333] transition-all duration-200 hover:shadow-[0_0_8px_rgba(138,99,210,0.3)] active:transform active:scale-95"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          ) : (
            <>
              <ChiRho size={24} className="mb-4" />
              <button
                onClick={handleToggleClick}
                className="w-full flex justify-center hover:bg-[#333] p-1 rounded-md transition-all duration-200 hover:shadow-[0_0_8px_rgba(138,99,210,0.3)] active:transform active:scale-95"
                aria-label="Expand sidebar"
              >
                <Menu size={24} />
              </button>
            </>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="mt-2 px-2">
          <button
            onClick={newChat}
            className="w-full flex items-center gap-3 p-2 rounded-md transition-all duration-200 hover:bg-[#333] hover:shadow-[0_0_8px_rgba(138,99,210,0.5)] active:transform active:scale-[0.98] focus:outline-none focus:ring-1 focus:ring-accent-purple"
          >
            <PlusCircle size={isCollapsed ? 24 : 20} />
            {!isCollapsed && <span>New chat</span>}
          </button>
        </div>

        {/* Recent chats section */}
        {!isCollapsed && (
          <div className="mt-6 flex-1 overflow-y-auto">
            <div className="px-4 py-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase">Recents</h3>
            </div>
            <div className="mt-1">
              {/* Show first 3 chats */}
              {recentChats.slice(0, 3).map((chat) => (
                <div key={chat.id} className="relative group">
                  <button
                    onClick={() => selectChat(chat.id)}
                    onMouseEnter={() => setHoveredChatId(chat.id)}
                    onMouseLeave={() => setHoveredChatId(null)}
                    className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 truncate focus:outline-none focus:ring-1 focus:ring-accent-purple flex items-center ${getHighlightClass(
                      chat,
                      hoveredChatId === chat.id,
                    )} ${getBackgroundClass(chat, hoveredChatId === chat.id)} ${
                      chat.status === "archived"
                        ? "text-gray-400"
                        : chat.status === "deleted"
                          ? "text-gray-400"
                          : "text-gray-300"
                    } ${currentChatId === chat.id ? "text-white" : ""}`}
                  >
                    {chat.status === "archived" && (
                      <Archive size={14} className="text-accent-gold mr-2 flex-shrink-0" />
                    )}
                    {chat.status === "starred" && <Star size={14} className="text-accent-gold mr-2 flex-shrink-0" />}
                    {chat.status === "deleted" && <Trash2 size={14} className="text-[#c41e3a] mr-2 flex-shrink-0" />}
                    <span className="truncate">{chat.title}</span>
                  </button>
                  <ChatActions chatId={chat.id} status={chat.status} />
                </div>
              ))}

              {/* Show next 2 chats faded if there are more than 3 */}
              {recentChats.length > 3 && (
                <div className={`transition-opacity duration-300 ${showAllRecents ? "opacity-100" : "opacity-60"}`}>
                  {recentChats.slice(3, 5).map((chat) => (
                    <div key={chat.id} className="relative group">
                      <button
                        onClick={() => selectChat(chat.id)}
                        onMouseEnter={() => setHoveredChatId(chat.id)}
                        onMouseLeave={() => setHoveredChatId(null)}
                        className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 truncate focus:outline-none focus:ring-1 focus:ring-accent-purple flex items-center ${getHighlightClass(
                          chat,
                          hoveredChatId === chat.id,
                        )} ${getBackgroundClass(chat, hoveredChatId === chat.id)} ${
                          chat.status === "archived"
                            ? "text-gray-400"
                            : chat.status === "deleted"
                              ? "text-gray-400"
                              : "text-gray-300"
                        } ${currentChatId === chat.id ? "text-white" : ""}`}
                      >
                        {chat.status === "archived" && (
                          <Archive size={14} className="text-accent-gold mr-2 flex-shrink-0" />
                        )}
                        {chat.status === "starred" && (
                          <Star size={14} className="text-accent-gold mr-2 flex-shrink-0" />
                        )}
                        {chat.status === "deleted" && (
                          <Trash2 size={14} className="text-[#c41e3a] mr-2 flex-shrink-0" />
                        )}
                        <span className="truncate">{chat.title}</span>
                      </button>
                      <ChatActions chatId={chat.id} status={chat.status} />
                    </div>
                  ))}
                </div>
              )}

              {/* Show more/less toggle if there are more than 5 chats */}
              {recentChats.length > 5 && (
                <div
                  className={`transition-opacity duration-300 ${showAllRecents ? "opacity-100 block" : "opacity-0 hidden"}`}
                >
                  {recentChats.slice(5, 10).map((chat) => (
                    <div key={chat.id} className="relative group">
                      <button
                        onClick={() => selectChat(chat.id)}
                        onMouseEnter={() => setHoveredChatId(chat.id)}
                        onMouseLeave={() => setHoveredChatId(null)}
                        className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 truncate focus:outline-none focus:ring-1 focus:ring-accent-purple flex items-center ${getHighlightClass(
                          chat,
                          hoveredChatId === chat.id,
                        )} ${getBackgroundClass(chat, hoveredChatId === chat.id)} ${
                          chat.status === "archived"
                            ? "text-gray-400"
                            : chat.status === "deleted"
                              ? "text-gray-400"
                              : "text-gray-300"
                        } ${currentChatId === chat.id ? "text-white" : ""}`}
                      >
                        {chat.status === "archived" && (
                          <Archive size={14} className="text-accent-gold mr-2 flex-shrink-0" />
                        )}
                        {chat.status === "starred" && (
                          <Star size={14} className="text-accent-gold mr-2 flex-shrink-0" />
                        )}
                        {chat.status === "deleted" && (
                          <Trash2 size={14} className="text-[#c41e3a] mr-2 flex-shrink-0" />
                        )}
                        <span className="truncate">{chat.title}</span>
                      </button>
                      <ChatActions chatId={chat.id} status={chat.status} />
                    </div>
                  ))}
                </div>
              )}

              {/* Toggle button */}
              {recentChats.length > 3 && (
                <button
                  onClick={() => setShowAllRecents(!showAllRecents)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-500 transition-all duration-200 hover:text-gray-300 hover:bg-[#333] flex items-center gap-1 hover:shadow-[0_0_8px_rgba(138,99,210,0.3)] active:bg-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-accent-purple"
                >
                  {showAllRecents ? (
                    <>
                      <ChevronDown size={14} />
                      <span>Show less</span>
                    </>
                  ) : (
                    <>
                      <ChevronRight size={14} />
                      <span>Show more</span>
                    </>
                  )}
                </button>
              )}

              {/* Chat History link */}
              <button
                onClick={() => setIsChatHistoryOpen(true)}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 transition-all duration-200 hover:bg-[#333] hover:text-white mt-2 font-medium hover:shadow-[0_0_8px_rgba(138,99,210,0.3)] active:bg-[#3a3a3a] focus:outline-none focus:ring-1 focus:ring-accent-purple"
              >
                Chat History
              </button>
            </div>

            {/* Archived chats section */}
            <div className="mt-4">
              <div
                className="px-4 py-2 flex items-center justify-between cursor-pointer group relative transition-all duration-200"
                onClick={() => setShowAllArchived(!showAllArchived)}
                onMouseEnter={() => setIsArchivedHovered(true)}
                onMouseLeave={() => setIsArchivedHovered(false)}
              >
                <h3 className="text-xs font-medium text-gray-500 uppercase group-hover:text-gray-300">Archived</h3>
                {showAllArchived ? (
                  <ChevronDown size={14} className="text-gray-500 group-hover:text-gray-300" />
                ) : (
                  <ChevronRight size={14} className="text-gray-500 group-hover:text-gray-300" />
                )}

                {/* Purple glow effect on hover */}
                <div
                  className={`absolute inset-0 rounded-md transition-opacity duration-300 pointer-events-none ${isArchivedHovered ? "opacity-20 shadow-[0_0_15px_rgba(138,99,210,0.8)]" : "opacity-0"}`}
                  style={{ background: "rgba(138, 99, 210, 0.1)" }}
                ></div>
              </div>

              {/* Archived chats list */}
              {showAllArchived && (
                <div className="mt-1">
                  {archivedChats.map((chat) => (
                    <div key={chat.id} className="relative group">
                      <button
                        onClick={() => selectChat(chat.id)}
                        onMouseEnter={() => setHoveredChatId(chat.id)}
                        onMouseLeave={() => setHoveredChatId(null)}
                        className={`w-full text-left px-4 py-2 text-sm text-gray-400 transition-all duration-200 hover:text-gray-300 truncate focus:outline-none focus:ring-1 focus:ring-accent-gold ${getHighlightClass(
                          chat,
                          hoveredChatId === chat.id,
                        )} ${getBackgroundClass(chat, hoveredChatId === chat.id)} ${currentChatId === chat.id ? "text-gray-300" : ""}`}
                      >
                        <div className="flex items-center">
                          <Archive size={14} className="text-accent-gold mr-2 flex-shrink-0" />
                          <span className="truncate">{chat.title}</span>
                        </div>
                      </button>
                      <ChatActions chatId={chat.id} status={chat.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* User profile section at bottom */}
        {!isCollapsed ? (
          <UserProfile />
        ) : (
          <div className="mt-auto border-t border-[#333] p-3 flex justify-center">
            <div className="w-8 h-8 rounded-full bg-[#555] flex items-center justify-center transition-all duration-200 hover:bg-[#666] hover:shadow-[0_0_8px_rgba(138,99,210,0.5)] cursor-pointer">
              <span className="text-sm font-medium">G</span>
            </div>
          </div>
        )}
      </aside>

      {/* Chat History Drawer */}
      <ChatHistoryDrawer isOpen={isChatHistoryOpen} onClose={() => setIsChatHistoryOpen(false)} />
    </>
  )
}
