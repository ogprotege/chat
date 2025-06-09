import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./client-layout"

export const metadata: Metadata = {
  title: "ex314.ai | Catholic Theological AI Assistant",
  description: "A Catholic theological AI assistant built with React and Next.js",
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
