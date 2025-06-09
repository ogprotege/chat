import { Sparkles, Zap } from "lucide-react"

interface ModelBadgeProps {
  modelId: string
  provider: "openai" | "together"
  className?: string
}

export const ModelBadge = ({ modelId, provider, className = "" }: ModelBadgeProps) => {
  // Get display name based on model ID
  const getDisplayName = () => {
    // OpenAI models
    if (modelId === "gpt-3.5-turbo") return "GPT-3.5"
    if (modelId === "gpt-4o") return "GPT-4o"

    // Together models
    if (modelId === "mistralai/Mixtral-8x7B-Instruct-v0.1") return "Mixtral 8x7B"
    if (modelId === "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo") return "Llama 3.1"
    if (modelId === "anthropic/claude-3-opus-20240229") return "Claude 3"

    // Fallback to shortened ID
    return modelId.split("/").pop() || modelId
  }

  return (
    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${className}`}>
      {provider === "openai" ? (
        <Sparkles size={10} className="text-accent-purple" />
      ) : (
        <Zap size={10} className="text-accent-gold" />
      )}
      <span>{getDisplayName()}</span>
    </div>
  )
}
