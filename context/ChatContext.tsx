"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Message } from "@/lib/types"

// Define model types
export interface Model {
  id: string
  name: string
  provider: "openai" | "together"
  description: string
  contextWindow?: number
  temperature?: number
}

// Define chat types
export interface Chat {
  id: string
  title: string
  status: "active" | "starred" | "archived" | "deleted"
  preview?: string
  messages?: Message[] // Add messages for search functionality
}

// Define the context type
interface ChatContextType {
  messages: Message[]
  currentChatId: string | null
  currentModel: Model
  availableModels: Model[]
  chats: Chat[]
  visibleChats: Chat[]
  isLoading: boolean
  isStreaming: boolean
  streamingContent: string
  setCurrentModel: (model: Model) => void
  addMessage: (message: Message) => void
  clearMessages: () => void
  selectChat: (chatId: string) => void
  newChat: () => void
  updateChat: (id: string, update: Partial<Chat>) => void
  deleteChat: (id: string) => void
  exportChats: () => void
  searchMessages: (query: string) => void
  searchChatContent: (query: string) => Chat[]
  filterChats: (status: "all" | "starred" | "archived" | "deleted") => void
}

// Create the context with default values
const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Browser check for server-side rendering
const isBrowser = typeof window !== "undefined"

function getUserId() {
  // Add check before localStorage access
  if (!isBrowser) return ""

  let id = localStorage.getItem("user_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("user_id", id)
  }
  return id
}

function getStorageKey(chatId: string) {
  const userId = getUserId()
  return `chat_history_${chatId}_${userId}`
}

// Sample messages for demonstration
const sampleMessages: Record<string, Message[]> = {
  "theological-grace": [
    {
      id: "1",
      role: "user",
      content: "What is the Catholic understanding of grace and how does it differ from Protestant views?",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      role: "assistant",
      content:
        "In Catholic theology, grace is understood as God's free and undeserved gift that sanctifies the soul and enables participation in divine life. Catholics distinguish between sanctifying grace (which makes one holy) and actual grace (which helps in specific situations). The Catholic view emphasizes cooperation with grace through faith and good works.\n\nProtestant views, particularly in Lutheran and Reformed traditions, often emphasize grace as God's favor that justifies sinners through faith alone (sola fide). Many Protestants make a sharper distinction between justification (being declared righteous) and sanctification (becoming holy). The Protestant emphasis is more on grace as God's unmerited favor rather than an infused quality that transforms the soul.",
      timestamp: new Date().toISOString(),
    },
  ],
  // Other sample messages...
}

// Create the provider component
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [currentModel, setCurrentModel] = useState<Model>({
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "OpenAI's most advanced model",
    contextWindow: 128000,
    temperature: 0.7,
  })
  const [availableModels] = useState<Model[]>([
    {
      id: "gpt-4o",
      name: "GPT-4o",
      provider: "openai",
      description: "OpenAI's most advanced model",
      contextWindow: 128000,
      temperature: 0.7,
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      provider: "openai",
      description: "Fast and efficient model for most tasks",
      contextWindow: 16000,
      temperature: 0.7,
    },
    {
      id: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      name: "Mixtral 8x7B",
      provider: "together",
      description: "Powerful open-source model",
      contextWindow: 32000,
      temperature: 0.7,
    },
    {
      id: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      name: "Llama 3.1",
      provider: "together",
      description: "Meta's latest model optimized for speed",
      contextWindow: 8000,
      temperature: 0.7,
    },
  ])
  const [chats, setChats] = useState<Chat[]>([
    // Current chats
    {
      id: Date.now().toString(),
      title: "Theological Discussion on Grace",
      status: "active",
      preview: "What is the Catholic understanding of grace and how does it differ from Protestant views?",
    },
    {
      id: (Date.now() - 86400000).toString(), // 1 day ago
      title: "Church Fathers Study",
      status: "active",
      preview: "Can you explain St. Augustine's view on predestination?",
    },

    // Starred chats
    {
      id: (Date.now() - 172800000).toString(), // 2 days ago
      title: "Vatican II Documents",
      status: "starred",
      preview: "What were the key reforms introduced by the Second Vatican Council?",
    },
    {
      id: (Date.now() - 259200000).toString(), // 3 days ago
      title: "Biblical Interpretation",
      status: "starred",
      preview: "How does the Catholic Church approach biblical hermeneutics?",
    },

    // Archived chats
    {
      id: (Date.now() - 345600000).toString(), // 4 days ago
      title: "Liturgical Questions",
      status: "archived",
      preview: "What is the significance of the different liturgical seasons?",
    },
    {
      id: (Date.now() - 432000000).toString(), // 5 days ago
      title: "Sacramental Theology",
      status: "archived",
      preview: "Can you explain the Catholic understanding of transubstantiation?",
    },
    {
      id: (Date.now() - 518400000).toString(), // 6 days ago
      title: "Understanding the Trinity",
      status: "archived",
      preview: "Can you help me understand the doctrine of the Trinity?",
    },
    {
      id: (Date.now() - 604800000).toString(), // 7 days ago
      title: "Exploring Papal Infallibility",
      status: "archived",
      preview: "What does papal infallibility mean and when does it apply?",
    },

    // Deleted chat
    {
      id: (Date.now() - 691200000).toString(), // 8 days ago
      title: "Draft Questions",
      status: "deleted",
      preview: "This is a draft that was deleted",
    },
  ])
  const [visibleChats, setVisibleChats] = useState<Chat[]>(chats)
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")

  // Load sample messages for demo chats
  useEffect(() => {
    if (!isBrowser) return

    // Map chat titles to sample message keys
    const chatToSampleKey: Record<string, string> = {
      "Theological Discussion on Grace": "theological-grace",
      "Church Fathers Study": "church-fathers",
      "Vatican II Documents": "vatican-ii",
      "Biblical Interpretation": "biblical-interpretation",
      "Liturgical Questions": "liturgical-questions",
      "Sacramental Theology": "sacramental-theology",
      "Understanding the Trinity": "trinity-understanding",
      "Exploring Papal Infallibility": "papal-infallibility",
    }

    // Store sample messages in localStorage for each chat
    chats.forEach((chat) => {
      const sampleKey = chatToSampleKey[chat.title]
      if (sampleKey && sampleMessages[sampleKey]) {
        localStorage.setItem(getStorageKey(chat.id), JSON.stringify(sampleMessages[sampleKey]))
      }
    })
  }, [])

  useEffect(() => {
    // Add check before localStorage access
    if (!isBrowser) return

    const stored = localStorage.getItem("chat_threads")
    if (stored) {
      const parsedChats = JSON.parse(stored)
      setChats(parsedChats)
      setVisibleChats(parsedChats)
    } else {
      // If no stored chats, save the default ones
      localStorage.setItem("chat_threads", JSON.stringify(chats))
    }
  }, [])

  useEffect(() => {
    if (currentChatId) {
      // Add check before localStorage access
      if (!isBrowser) return

      const local = localStorage.getItem(getStorageKey(currentChatId))
      if (local) {
        setMessages(JSON.parse(local))
      } else {
        // If no messages for this chat, initialize with empty array
        setMessages([])
      }
    }
  }, [currentChatId])

  const persistChats = (updated: Chat[]) => {
    setChats(updated)
    setVisibleChats(updated)

    // Add check before localStorage access
    if (isBrowser) {
      localStorage.setItem("chat_threads", JSON.stringify(updated))
    }
  }

  const updateChat = (id: string, update: Partial<Chat>) => {
    const updated = chats.map((c) => (c.id === id ? { ...c, ...update } : c))
    persistChats(updated)
  }

  const deleteChat = (id: string) => {
    // Instead of removing the chat, update its status to 'deleted'
    const updated = chats.map((chat) => {
      if (chat.id === id) {
        return {
          ...chat,
          status: "deleted" as const, // Use const assertion to fix TypeScript error
        }
      }
      return chat
    })

    persistChats(updated)

    if (id === currentChatId) {
      setCurrentChatId(null)
      setMessages([])
    }
  }

  const addMessage = (message: Message) => {
    if (!currentChatId) {
      // If no current chat, create one
      const newChatId = Date.now().toString()
      const newChatTitle = message.content.length > 30 ? message.content.substring(0, 30) + "..." : message.content

      const newChat: Chat = {
        id: newChatId,
        title: newChatTitle,
        status: "active",
        preview: message.content,
      }

      const updatedChats = [newChat, ...chats]
      persistChats(updatedChats)
      setCurrentChatId(newChatId)

      // Initialize with this message
      setMessages([message])
      if (isBrowser) {
        localStorage.setItem(getStorageKey(newChatId), JSON.stringify([message]))
      }
      return
    }

    const updatedMessages = [...messages, message]
    setMessages(updatedMessages)

    // Add check before localStorage access
    if (isBrowser) {
      localStorage.setItem(getStorageKey(currentChatId), JSON.stringify(updatedMessages))
    }

    // Update chat preview if it's a user message
    if (message.role === "user") {
      const preview = message.content.length > 64 ? message.content.slice(0, 64) + "..." : message.content

      // Also update the chat title if this is the first message
      let title = null
      if (updatedMessages.filter((m) => m.role === "user").length === 1) {
        title = message.content.length > 30 ? message.content.substring(0, 30) + "..." : message.content
      }

      const updatedChat = chats.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              preview,
              ...(title ? { title } : {}),
            }
          : chat,
      )

      persistChats(updatedChat)
    }
  }

  const clearMessages = () => {
    setMessages([])
    if (currentChatId && isBrowser) {
      localStorage.removeItem(getStorageKey(currentChatId))
    }
  }

  const newChat = () => {
    const id = Date.now().toString()
    const chat: Chat = {
      id,
      title: "New Chat",
      status: "active",
      preview: "",
    }
    const updated = [chat, ...chats]
    persistChats(updated)
    setCurrentChatId(id)
    setMessages([])

    // Initialize empty message array in localStorage
    if (isBrowser) {
      localStorage.setItem(getStorageKey(id), JSON.stringify([]))
    }

    return id
  }

  const selectChat = (id: string) => {
    setCurrentChatId(id)
  }

  const filterChats = (status: "all" | "starred" | "archived" | "deleted") => {
    if (status === "all") {
      setVisibleChats(chats)
    } else {
      setVisibleChats(chats.filter((chat) => chat.status === status))
    }
  }

  // Enhanced search function that searches through chat content
  const searchChatContent = (query: string): Chat[] => {
    if (!isBrowser || !query.trim()) return []

    const searchLower = query.toLowerCase()
    const results: Chat[] = []

    chats.forEach((chat) => {
      // Check title and preview first
      if (
        chat.title.toLowerCase().includes(searchLower) ||
        (chat.preview && chat.preview.toLowerCase().includes(searchLower))
      ) {
        results.push(chat)
        return
      }

      // Check chat messages content
      const chatMessages = JSON.parse(localStorage.getItem(getStorageKey(chat.id)) || "[]") as Message[]

      for (const message of chatMessages) {
        if (message.content.toLowerCase().includes(searchLower)) {
          results.push(chat)
          return // Only add the chat once even if multiple messages match
        }
      }
    })

    return results
  }

  const searchMessages = (query: string) => {
    if (!isBrowser) return

    if (!query.trim()) {
      setVisibleChats(chats)
      return
    }

    const results = searchChatContent(query)
    setVisibleChats(results)
  }

  const exportChats = () => {
    // Add check before localStorage access
    if (!isBrowser) return

    const userId = getUserId()
    if (userId !== "admin") return alert("Only admin can export")

    const exportData: Record<string, Message[]> = {}
    chats.forEach((chat) => {
      const data = localStorage.getItem(getStorageKey(chat.id))
      if (data) exportData[chat.title] = JSON.parse(data)
    })

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `ex314_export.json`
    link.click()
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        currentChatId,
        currentModel,
        availableModels,
        chats,
        visibleChats,
        isLoading,
        isStreaming,
        streamingContent,
        setCurrentModel,
        addMessage,
        clearMessages,
        selectChat,
        newChat,
        updateChat,
        deleteChat,
        exportChats,
        searchMessages,
        searchChatContent,
        filterChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

// Create a hook to use the context
export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
