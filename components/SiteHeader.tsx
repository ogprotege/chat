"use client"

import { useState, useEffect } from "react"
import { ChiRho } from "@/components/ChiRho"
import { ChevronDown, ChevronUp } from "lucide-react"

interface SiteHeaderProps {
  username?: string
  isInputFocused?: boolean
}

export function SiteHeader({ username = "Guest", isInputFocused = false }: SiteHeaderProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  // Automatically collapse description when input is focused
  useEffect(() => {
    if (isInputFocused && isDescriptionExpanded) {
      setIsDescriptionExpanded(false)
    }
  }, [isInputFocused, isDescriptionExpanded])

  return (
    <header className="container mx-auto pt-6 pb-2 px-4 transition-all duration-300">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <ChiRho size={32} className="text-accent-purple" />
          <h1 className="text-xl md:text-2xl font-medium text-accent-purple">
            ex314.ai | Where Divine Truth Meets Digital Inquiry
          </h1>
        </div>

        <div className="w-full max-w-[950px] mx-auto">
          {/* Contact info - always visible */}
          <p className="text-sm text-gray-300 mb-1">
            For all questions, comments, suggestions, curses, praises, contact{" "}
            <a
              href="mailto:notapharisee@ex314.ai"
              className="text-accent-gold hover:text-accent-gold relative inline-block transition-all duration-300 group"
            >
              notapharisee@ex314.ai
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              <span className="absolute -inset-1 bg-accent-gold/10 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </a>
          </p>

          {/* Toggle button */}
          <button
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="text-xs text-gray-400 flex items-center gap-1 mx-auto mb-1 hover:text-gray-300 transition-colors"
          >
            {isDescriptionExpanded ? (
              <>
                <ChevronUp size={14} />
                <span>Hide description</span>
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                <span>Show description</span>
              </>
            )}
          </button>

          {/* Collapsible description */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isDescriptionExpanded
                ? "max-h-[200px] opacity-100 p-4 bg-[#1a1a1a] rounded-lg border border-[#383838] shadow-sm"
                : "max-h-0 opacity-0"
            }`}
          >
            <p className="text-sm text-gray-300 leading-relaxed">
              <strong className="text-accent-purple font-semibold">A.I., SANCTIFIED.</strong> This is theology without
              confusion and philosophy without fog. Not built to replace the Magisterium, but to serve it, this is the
              first LLM fine-tuned for clarity, approachability, and the New Evangelization. Trained on the full depth
              of Catholic teaching, it doesn't improvise or compromise. It explains, illuminates, and defends the faith
              with clarity, reverence, patience, and compassion—to find the lost seeking the Way, to steady the shaken
              searching for the Truth.
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
