"use client"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { ChatView } from "@/components/chat/ChatView"
import { useChat } from "@/context/ChatContext"
import type { Message } from "@/lib/types"

export default function ChatPage() {
  const { messages, addMessage, currentModel } = useChat()
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Create a user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    }

    // Add the user message to the chat
    addMessage(userMessage)

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
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-dark-bg text-white">
      <ChatView messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
    </div>
  )
}
