"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, Filter, X, ChevronDown, User, Bot } from "lucide-react"
import { format } from "date-fns"
import { trackChatFeature } from "@/lib/analytics/chat-analytics"

export type MessageFilter = {
  type?: "user" | "assistant" | "all"
  dateRange?: {
    from?: Date
    to?: Date
  }
  preset?: "today" | "yesterday" | "last7days" | "last30days" | "custom" | "all"
}

interface ChatFilterProps {
  onFilterChange: (filter: MessageFilter) => void
  isOpen: boolean
  onClose: () => void
}

export function ChatFilter({ onFilterChange, isOpen, onClose }: ChatFilterProps) {
  const [filter, setFilter] = useState<MessageFilter>({ type: "all", preset: "all" })
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  const datePickerRef = useRef<HTMLDivElement>(null)

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Apply filter changes
  const applyFilter = (newFilter: Partial<MessageFilter>) => {
    const updatedFilter = { ...filter, ...newFilter }
    setFilter(updatedFilter)
    onFilterChange(updatedFilter)

    // Track filter usage
    trackChatFeature("filter_messages", {
      type: updatedFilter.type,
      date_preset: updatedFilter.preset,
    })
  }

  // Handle type filter changes
  const handleTypeChange = (type: "user" | "assistant" | "all") => {
    applyFilter({ type })
  }

  // Handle date preset changes
  const handleDatePresetChange = (preset: MessageFilter["preset"]) => {
    let dateRange = {}

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const last7days = new Date(today)
    last7days.setDate(last7days.getDate() - 7)

    const last30days = new Date(today)
    last30days.setDate(last30days.getDate() - 30)

    switch (preset) {
      case "today":
        dateRange = { from: today, to: new Date() }
        break
      case "yesterday":
        dateRange = { from: yesterday, to: today }
        break
      case "last7days":
        dateRange = { from: last7days, to: new Date() }
        break
      case "last30days":
        dateRange = { from: last30days, to: new Date() }
        break
      case "custom":
        setIsDatePickerOpen(true)
        dateRange = filter.dateRange || {}
        break
      case "all":
      default:
        dateRange = {}
        break
    }

    applyFilter({ preset, dateRange })
  }

  // Handle custom date range changes
  const handleCustomDateChange = (type: "from" | "to", date: Date) => {
    const dateRange = {
      ...filter.dateRange,
      [type]: date,
    }

    applyFilter({ dateRange, preset: "custom" })
  }

  // Format date for display
  const formatDateDisplay = () => {
    if (filter.preset === "all" || !filter.preset) return "All time"
    if (filter.preset === "today") return "Today"
    if (filter.preset === "yesterday") return "Yesterday"
    if (filter.preset === "last7days") return "Last 7 days"
    if (filter.preset === "last30days") return "Last 30 days"

    if (filter.preset === "custom" && filter.dateRange) {
      const from = filter.dateRange.from ? format(filter.dateRange.from, "MMM d, yyyy") : "Start"
      const to = filter.dateRange.to ? format(filter.dateRange.to, "MMM d, yyyy") : "End"
      return `${from} - ${to}`
    }

    return "All time"
  }

  if (!isOpen) return null

  return (
    <div
      className="absolute top-12 right-0 z-50 w-64 bg-card-bg border border-[#444] rounded-md shadow-lg"
      ref={filterRef}
    >
      <div className="flex justify-between items-center p-3 border-b border-[#444]">
        <h3 className="text-sm font-medium text-white">Filter Messages</h3>
        <button onClick={onClose} className="text-gray-custom hover:text-white" aria-label="Close filter">
          <X size={16} />
        </button>
      </div>

      <div className="p-3 border-b border-[#444]">
        <h4 className="text-xs font-medium text-gray-custom mb-2">By Sender</h4>
        <div className="flex gap-2">
          <button
            onClick={() => handleTypeChange("all")}
            className={`px-3 py-1.5 text-xs rounded-md flex items-center gap-1.5 ${
              filter.type === "all" ? "bg-accent-purple text-white" : "bg-[#333] text-gray-custom hover:text-white"
            }`}
          >
            <Filter size={12} />
            All
          </button>
          <button
            onClick={() => handleTypeChange("user")}
            className={`px-3 py-1.5 text-xs rounded-md flex items-center gap-1.5 ${
              filter.type === "user" ? "bg-accent-purple text-white" : "bg-[#333] text-gray-custom hover:text-white"
            }`}
          >
            <User size={12} />
            You
          </button>
          <button
            onClick={() => handleTypeChange("assistant")}
            className={`px-3 py-1.5 text-xs rounded-md flex items-center gap-1.5 ${
              filter.type === "assistant"
                ? "bg-accent-purple text-white"
                : "bg-[#333] text-gray-custom hover:text-white"
            }`}
          >
            <Bot size={12} />
            AI
          </button>
        </div>
      </div>

      <div className="p-3">
        <h4 className="text-xs font-medium text-gray-custom mb-2">By Date</h4>
        <div className="relative">
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="w-full px-3 py-1.5 text-xs rounded-md bg-[#333] text-white flex justify-between items-center"
          >
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {formatDateDisplay()}
            </span>
            <ChevronDown size={12} />
          </button>

          {isDatePickerOpen && (
            <div
              className="absolute top-full left-0 mt-1 w-full bg-card-bg border border-[#444] rounded-md shadow-lg z-10"
              ref={datePickerRef}
            >
              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    handleDatePresetChange("all")
                    setIsDatePickerOpen(false)
                  }}
                  className="w-full px-2 py-1.5 text-xs text-left rounded hover:bg-[#333]"
                >
                  All time
                </button>
                <button
                  onClick={() => {
                    handleDatePresetChange("today")
                    setIsDatePickerOpen(false)
                  }}
                  className="w-full px-2 py-1.5 text-xs text-left rounded hover:bg-[#333]"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    handleDatePresetChange("yesterday")
                    setIsDatePickerOpen(false)
                  }}
                  className="w-full px-2 py-1.5 text-xs text-left rounded hover:bg-[#333]"
                >
                  Yesterday
                </button>
                <button
                  onClick={() => {
                    handleDatePresetChange("last7days")
                    setIsDatePickerOpen(false)
                  }}
                  className="w-full px-2 py-1.5 text-xs text-left rounded hover:bg-[#333]"
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => {
                    handleDatePresetChange("last30days")
                    setIsDatePickerOpen(false)
                  }}
                  className="w-full px-2 py-1.5 text-xs text-left rounded hover:bg-[#333]"
                >
                  Last 30 days
                </button>
                <button
                  onClick={() => handleDatePresetChange("custom")}
                  className="w-full px-2 py-1.5 text-xs text-left rounded hover:bg-[#333]"
                >
                  Custom range
                </button>
              </div>

              {filter.preset === "custom" && (
                <div className="p-2 border-t border-[#444]">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-custom">From</label>
                      <input
                        type="date"
                        className="w-full mt-1 px-2 py-1 text-xs bg-[#333] border border-[#555] rounded"
                        value={filter.dateRange?.from ? format(filter.dateRange.from, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleCustomDateChange("from", new Date(e.target.value))
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-custom">To</label>
                      <input
                        type="date"
                        className="w-full mt-1 px-2 py-1 text-xs bg-[#333] border border-[#555] rounded"
                        value={filter.dateRange?.to ? format(filter.dateRange.to, "yyyy-MM-dd") : ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleCustomDateChange("to", new Date(e.target.value))
                          }
                        }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDatePickerOpen(false)}
                    className="w-full mt-2 px-2 py-1.5 text-xs bg-accent-purple text-white rounded"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-[#444] flex justify-between">
        <button
          onClick={() => {
            setFilter({ type: "all", preset: "all" })
            onFilterChange({ type: "all", preset: "all" })
          }}
          className="text-xs text-accent-purple hover:underline"
        >
          Reset filters
        </button>
        <button onClick={onClose} className="px-3 py-1 text-xs bg-accent-purple text-white rounded-md">
          Done
        </button>
      </div>
    </div>
  )
}
