"use client"

import { useState } from "react"
import { useChat } from "@/context/ChatContext"
import { ChevronDown, Sparkles, Zap, Info } from "lucide-react"
import { trackChatFeature } from "@/lib/analytics/chat-analytics"

export const ModelSelector = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { currentModel, availableModels, setCurrentModel } = useChat()

  const handleModelChange = (modelId: string) => {
    const model = availableModels.find((m) => m.id === modelId)
    if (model) {
      setCurrentModel(model)
      trackChatFeature("model_change", { from: currentModel.id, to: model.id })
    }
    setIsOpen(false)
  }

  // Format context window size for display
  const formatContextSize = (size?: number) => {
    if (!size) return "Unknown"
    if (size >= 1000000) return `${(size / 1000000).toFixed(1)}M tokens`
    if (size >= 1000) return `${(size / 1000).toFixed(0)}K tokens`
    return `${size} tokens`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-card-bg border border-[#444] hover:bg-[#333] transition-colors"
      >
        {currentModel.provider === "openai" ? (
          <Sparkles size={14} className="text-accent-purple" />
        ) : (
          <Zap size={14} className="text-accent-gold" />
        )}
        <span className="text-white">{currentModel.name}</span>
        <ChevronDown size={14} className={`text-gray-custom transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-72 bg-card-bg border border-[#444] rounded-md shadow-lg z-10">
          <div className="p-2">
            <div className="text-xs text-gray-custom mb-2 px-2 py-1 flex items-center justify-between">
              <span>Select AI Model</span>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1 mr-3">
                  <Sparkles size={12} className="text-accent-purple" />
                  <span>OpenAI</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={12} className="text-accent-gold" />
                  <span>Together</span>
                </div>
              </div>
            </div>
            {availableModels.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelChange(model.id)}
                className={`w-full text-left p-2 rounded-md flex items-start gap-2 ${
                  currentModel.id === model.id ? "bg-[#333]" : "hover:bg-[#333]"
                }`}
              >
                {model.provider === "openai" ? (
                  <Sparkles size={16} className="text-accent-purple mt-0.5" />
                ) : (
                  <Zap size={16} className="text-accent-gold mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{model.name}</div>
                  <div className="text-xs text-gray-custom">{model.description}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-custom bg-[#222] px-1.5 py-0.5 rounded">
                      {formatContextSize(model.contextWindow)}
                    </span>
                    <span className="text-xs text-gray-custom bg-[#222] px-1.5 py-0.5 rounded">
                      Temp: {model.temperature}
                    </span>
                  </div>
                </div>
                {currentModel.id === model.id && <div className="w-2 h-2 rounded-full bg-accent-purple mt-1.5"></div>}
              </button>
            ))}
            <div className="mt-2 pt-2 border-t border-[#444] px-2">
              <div className="flex items-center gap-1 text-xs text-gray-custom">
                <Info size={12} />
                <span>Model selection affects response quality and speed</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
