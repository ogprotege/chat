"use client"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Sidebar } from "@/components/sidebar/Sidebar"
import { SiteHeader } from "@/components/SiteHeader"
import { ChatView } from "@/components/chat/ChatView"
import { InitialView } from "@/components/chat/InitialView"
import { useChat } from "@/context/ChatContext"
import type { Message } from "@/lib/types"
import { SiteFooter } from "@/components/SiteFooter"

export default function HomePage() {
  const { messages, addMessage, currentModel, newChat, currentChatId, selectChat } = useChat()
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [localMessages, setLocalMessages] = useState<Message[]>([])

  // In a real app, this would come from authentication or user settings
  const [username, setUsername] = useState("Guest")

  // Load username from localStorage if available
  useEffect(() => {
    const savedName = localStorage.getItem("user_name")
    if (savedName) {
      setUsername(savedName)
    }
  }, [])

  // Ensure we have a current chat ID
  useEffect(() => {
    if (!currentChatId) {
      // Create a new chat if we don't have one
      newChat()
    }
  }, [currentChatId, newChat])

  // Sync messages from context
  useEffect(() => {
    setLocalMessages(messages)
  }, [messages])

  const handleSendMessage = async (content: string) => {
    // If we don't have a current chat, create one
    if (!currentChatId) {
      newChat()
    }

    // Create a user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    }

    // Add the user message to the chat
    addMessage(userMessage)

    // Update local messages immediately for UI responsiveness
    setLocalMessages((prev) => [...prev, userMessage])

    // Set loading state
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create an AI response
      const aiMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: `This is a simulated response to: "${content}"`,
        timestamp: new Date().toISOString(),
        modelId: currentModel.id,
        provider: currentModel.provider,
      }

      // Add the AI message to the chat
      addMessage(aiMessage)

      // Update local messages
      setLocalMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "I'm sorry, there was an error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      }

      addMessage(errorMessage)
      setLocalMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev)
  }

  // Handle input focus state
  const handleInputFocus = (focused: boolean) => {
    setIsInputFocused(focused)
  }

  return (
    <div className="flex h-screen bg-[#171717] text-white">
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <SiteHeader username={username} isInputFocused={isInputFocused} />

        <div className="flex-1 overflow-hidden border-t-0">
          {localMessages.length === 0 && !isLoading ? (
            <InitialView onSendMessage={handleSendMessage} username={username} onInputFocus={handleInputFocus} />
          ) : (
            <ChatView
              messages={localMessages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              username={username}
              onInputFocus={handleInputFocus}
            />
          )}
        </div>

        <SiteFooter />
      </div>
    </div>
  )
}
