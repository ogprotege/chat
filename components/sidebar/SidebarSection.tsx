"use client"

import type React from "react"
import { useState } from "react"
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react"

interface SidebarSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-xs font-medium text-gray-custom px-2 py-1.5 hover:bg-[#333] rounded transition-colors"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDownIcon size={14} className="opacity-70" />
        ) : (
          <ChevronRightIcon size={14} className="opacity-70" />
        )}
      </button>
      <div
        className={`mt-1 transition-all duration-300 ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  )
}
