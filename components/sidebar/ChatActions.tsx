"use client"

import type React from "react"

import { useState } from "react"
import { Star, Archive, Trash2, MoreHorizontal, StarOff, ArchiveRestore } from "lucide-react"
import { useChat } from "@/context/ChatContext"

interface ChatActionsProps {
  chatId: string
  status: "active" | "starred" | "archived" | "deleted"
}

export function ChatActions({ chatId, status }: ChatActionsProps) {
  const { updateChat, deleteChat } = useChat()
  const [showMenu, setShowMenu] = useState(false)

  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateChat(chatId, { status: status === "starred" ? "active" : "starred" })
  }

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateChat(chatId, { status: status === "archived" ? "active" : "archived" })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteChat(chatId)
  }

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={handleStar}
        className="p-1 rounded-md hover:bg-[#333] transition-colors"
        title={status === "starred" ? "Unstar" : "Star"}
      >
        {status === "starred" ? (
          <StarOff size={14} className="text-gray-400 hover:text-accent-gold" />
        ) : (
          <Star size={14} className="text-gray-400 hover:text-accent-gold" />
        )}
      </button>

      <button
        onClick={handleArchive}
        className="p-1 rounded-md hover:bg-[#333] transition-colors"
        title={status === "archived" ? "Unarchive" : "Archive"}
      >
        {status === "archived" ? (
          <ArchiveRestore size={14} className="text-gray-400 hover:text-white" />
        ) : (
          <Archive size={14} className="text-gray-400 hover:text-white" />
        )}
      </button>

      <div className="relative">
        <button onClick={toggleMenu} className="p-1 rounded-md hover:bg-[#333] transition-colors" title="More options">
          <MoreHorizontal size={14} className="text-gray-400 hover:text-white" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 bg-card-bg border border-[#444] rounded-md shadow-lg z-10 w-32">
            <button
              onClick={handleDelete}
              className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-[#333] flex items-center gap-2"
            >
              <Trash2 size={12} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
