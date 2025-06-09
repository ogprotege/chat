"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Theme = "dark" | "light" | "system" | "custom"
type FontSize = "small" | "normal" | "large"

interface ThemeContextType {
  theme: Theme
  fontSize: FontSize
  accentColor: string
  setTheme: (theme: Theme) => void
  setFontSize: (size: FontSize) => void
  setAccentColor: (color: string) => void
  applyCustomTheme: (bg: string, text: string, accent: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [fontSize, setFontSize] = useState<FontSize>("normal")
  const [accentColor, setAccentColor] = useState("#8a63d2")

  useEffect(() => {
    // Load theme settings from localStorage on mount
    if (typeof window !== "undefined") {
      const savedTheme = (localStorage.getItem("theme") as Theme) || "dark"
      const savedFontSize = (localStorage.getItem("font_size") as FontSize) || "normal"
      const savedAccentColor = localStorage.getItem("accent_color") || "#8a63d2"

      setTheme(savedTheme)
      setFontSize(savedFontSize)
      setAccentColor(savedAccentColor)
    }

    // Listen for appearance updates
    const handleAppearanceUpdate = (event: CustomEvent) => {
      const { settings } = event.detail
      if (settings) {
        setTheme(settings.theme)
        setFontSize(settings.fontSize)
        setAccentColor(settings.accentColor)
      }
    }

    window.addEventListener("appearanceUpdated", handleAppearanceUpdate as EventListener)

    return () => {
      window.removeEventListener("appearanceUpdated", handleAppearanceUpdate as EventListener)
    }
  }, [])

  const applyCustomTheme = (bg: string, text: string, accent: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_bg", bg)
      localStorage.setItem("custom_text", text)
      localStorage.setItem("custom_accent", accent)

      const root = document.documentElement
      root.style.setProperty("--card-bg", bg)
      root.style.setProperty("--dark-bg", bg)
      root.style.setProperty("--dark-card-bg", bg)
      root.style.setProperty("--gray-custom", text)
      root.style.setProperty("--accent-purple", accent)
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        fontSize,
        accentColor,
        setTheme,
        setFontSize,
        setAccentColor,
        applyCustomTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
