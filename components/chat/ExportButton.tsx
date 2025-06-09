"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useChat } from "@/context/ChatContext"
import { trackChatFeature } from "@/lib/analytics/chat-analytics"
import type { Message } from "@/lib/types"

export function ExportButton() {
  const { messages, currentChatId } = useChat()
  const [isExporting, setIsExporting] = useState(false)

  const exportChat = async (format: "txt" | "json" | "md") => {
    if (!messages.length) return

    setIsExporting(true)

    try {
      // Format data based on export type
      let content = ""
      let mimeType = ""
      const fileExtension = format

      // Track the export action
      trackChatFeature("export_chat", { format })

      // Format data differently depending on type
      if (format === "txt") {
        content = formatAsTxt(messages)
        mimeType = "text/plain"
      } else if (format === "json") {
        content = formatAsJson(messages, currentChatId)
        mimeType = "application/json"
      } else if (format === "md") {
        content = formatAsMarkdown(messages)
        mimeType = "text/markdown"
      }

      // Download the file
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `chat-export-${currentChatId?.substring(0, 8) || "new"}.${fileExtension}`
      document.body.appendChild(a)
      a.click()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error("Error exporting chat:", error)
    } finally {
      setIsExporting(false)
    }
  }

  // Format helpers
  const formatAsTxt = (messages: Message[]) => {
    return messages
      .map(
        (m) => `[${new Date(m.timestamp).toLocaleString()}] ${m.role === "user" ? "You" : "Assistant"}: ${m.content}`,
      )
      .join("\n\n")
  }

  const formatAsJson = (messages: Message[], chatId: string | null) => {
    // Clean object for export, omitting internal properties
    const exportData = {
      id: chatId,
      exportDate: new Date().toISOString(),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })),
    }
    return JSON.stringify(exportData, null, 2)
  }

  const formatAsMarkdown = (messages: Message[]) => {
    return (
      `# Chat Export - ${new Date().toLocaleString()}\n\n` +
      messages
        .map(
          (m) =>
            `## ${m.role === "user" ? "You" : "Assistant"} - ${new Date(m.timestamp).toLocaleString()}\n\n${m.content}`,
        )
        .join("\n\n")
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          disabled={isExporting || !messages.length}
          data-export-button
        >
          <Download size={16} />
          <span>Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportChat("txt")}>Text File (.txt)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportChat("json")}>JSON Data (.json)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportChat("md")}>Markdown (.md)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
