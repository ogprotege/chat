"use client"

import type React from "react"

import { ChatProvider } from "@/context/ChatContext"
import { ThemeProvider } from "@/context/ThemeContext"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ChatProvider>{children}</ChatProvider>
    </ThemeProvider>
  )
}
