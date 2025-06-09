// Stub implementation of chat analytics
export const trackChatFeature = (featureName: string, properties?: Record<string, any>) => {
  // In a real implementation, this would send analytics data
  console.log(`[Analytics] Tracked: ${featureName}`, properties)
}
