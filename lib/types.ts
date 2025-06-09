export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  modelId?: string
  provider?: "openai" | "together"
}
