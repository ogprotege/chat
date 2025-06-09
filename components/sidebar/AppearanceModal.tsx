"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { XIcon, Moon, Sun, Monitor, Check, Palette } from "lucide-react"

interface AppearanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (settings: AppearanceSettings) => void
}

export type AppearanceSettings = {
  theme: "dark" | "light" | "system" | "custom"
  fontSize: "small" | "normal" | "large"
  accentColor: string
  customBg?: string
  customText?: string
  customAccent?: string
}

const PRESET_COLORS = [
  { name: "Purple", value: "#8a63d2" },
  { name: "Gold", value: "#f0b90b" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Teal", value: "#14b8a6" },
]

export const AppearanceModal = ({ isOpen, onClose, onSave }: AppearanceModalProps) => {
  const [settings, setSettings] = useState<AppearanceSettings>({
    theme: "dark",
    fontSize: "normal",
    accentColor: "#8a63d2",
  })

  useEffect(() => {
    // Load settings from localStorage
    const savedTheme = (localStorage.getItem("theme") as "dark" | "light" | "system" | "custom") || "dark"
    const savedFontSize = (localStorage.getItem("font_size") as "small" | "normal" | "large") || "normal"
    const savedAccentColor = localStorage.getItem("accent_color") || "#8a63d2"
    const savedCustomBg = localStorage.getItem("custom_bg")
    const savedCustomText = localStorage.getItem("custom_text")
    const savedCustomAccent = localStorage.getItem("custom_accent")

    setSettings({
      theme: savedTheme,
      fontSize: savedFontSize,
      accentColor: savedAccentColor,
      customBg: savedCustomBg || undefined,
      customText: savedCustomText || undefined,
      customAccent: savedCustomAccent || undefined,
    })
  }, [isOpen])

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem("theme", settings.theme)
    localStorage.setItem("font_size", settings.fontSize)
    localStorage.setItem("accent_color", settings.accentColor)

    if (settings.customBg) localStorage.setItem("custom_bg", settings.customBg)
    if (settings.customText) localStorage.setItem("custom_text", settings.customText)
    if (settings.customAccent) localStorage.setItem("custom_accent", settings.customAccent)

    // Apply theme to document
    applyTheme(settings)

    // Dispatch a custom event when appearance is saved
    if (typeof window !== "undefined") {
      const event = new CustomEvent("appearanceUpdated", {
        detail: { settings },
      })
      window.dispatchEvent(event)
    }

    onSave(settings)
    onClose()
  }

  const applyTheme = (themeSettings: AppearanceSettings) => {
    const root = document.documentElement

    // Apply accent color
    root.style.setProperty("--accent-purple", themeSettings.accentColor)

    // Apply font size
    const fontSizeMap = {
      small: "0.875rem",
      normal: "1rem",
      large: "1.125rem",
    }
    root.style.setProperty("--base-font-size", fontSizeMap[themeSettings.fontSize])

    // Apply theme colors
    if (themeSettings.theme === "light") {
      root.style.setProperty("--card-bg", "#f5f5f5")
      root.style.setProperty("--dark-bg", "#ffffff")
      root.style.setProperty("--dark-card-bg", "#f0f0f0")
      root.style.setProperty("--input-bg", "#e5e5e5")
      root.style.setProperty("--border-color", "#d4d4d4")
      root.style.setProperty("--gray-custom", "#666666")
      document.body.classList.remove("dark-theme")
      document.body.classList.add("light-theme")
    } else if (themeSettings.theme === "custom" && themeSettings.customBg && themeSettings.customText) {
      root.style.setProperty("--card-bg", themeSettings.customBg)
      root.style.setProperty("--dark-bg", adjustColor(themeSettings.customBg, -10))
      root.style.setProperty("--dark-card-bg", adjustColor(themeSettings.customBg, -5))
      root.style.setProperty("--input-bg", adjustColor(themeSettings.customBg, 10))
      root.style.setProperty("--border-color", adjustColor(themeSettings.customBg, 20))
      root.style.setProperty("--gray-custom", themeSettings.customText)
      document.body.classList.remove("dark-theme", "light-theme")
      document.body.classList.add("custom-theme")
    } else {
      // Default dark theme
      root.style.setProperty("--card-bg", "#1e1e1e")
      root.style.setProperty("--dark-bg", "#121212")
      root.style.setProperty("--dark-card-bg", "#1a1a1a")
      root.style.setProperty("--input-bg", "#2a2a2a")
      root.style.setProperty("--border-color", "#333333")
      root.style.setProperty("--gray-custom", "#a0a0a0")
      document.body.classList.remove("light-theme")
      document.body.classList.add("dark-theme")
    }
  }

  // Helper function to adjust color brightness
  const adjustColor = (color: string, amount: number): string => {
    return color // Simplified for now, would implement proper color adjustment
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="w-full max-w-[280px] bg-dark-bg border border-[#444] rounded-lg shadow-2xl p-3 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white transition">
          <XIcon size={14} />
        </button>

        <h2 className="text-sm font-semibold text-accent-purple mb-2">Appearance</h2>

        {/* Theme Selection */}
        <div className="mb-3">
          <h3 className="text-[10px] font-medium text-gray-300 mb-1.5">Theme</h3>
          <div className="grid grid-cols-3 gap-1.5">
            <ThemeOption
              icon={<Moon size={12} />}
              label="Dark"
              isSelected={settings.theme === "dark"}
              onClick={() => setSettings({ ...settings, theme: "dark" })}
            />
            <ThemeOption
              icon={<Sun size={12} />}
              label="Light"
              isSelected={settings.theme === "light"}
              onClick={() => setSettings({ ...settings, theme: "light" })}
            />
            <ThemeOption
              icon={<Monitor size={12} />}
              label="System"
              isSelected={settings.theme === "system"}
              onClick={() => setSettings({ ...settings, theme: "system" })}
            />
          </div>
        </div>

        {/* Font Size */}
        <div className="mb-3">
          <h3 className="text-[10px] font-medium text-gray-300 mb-1.5">Font Size</h3>
          <div className="flex space-x-1.5">
            <button
              onClick={() => setSettings({ ...settings, fontSize: "small" })}
              className={`px-2 py-1 rounded-md text-[10px] ${
                settings.fontSize === "small"
                  ? "bg-accent-purple text-white"
                  : "bg-[#333] text-gray-300 hover:bg-[#444]"
              }`}
            >
              Small
            </button>
            <button
              onClick={() => setSettings({ ...settings, fontSize: "normal" })}
              className={`px-2 py-1 rounded-md text-[10px] ${
                settings.fontSize === "normal"
                  ? "bg-accent-purple text-white"
                  : "bg-[#333] text-gray-300 hover:bg-[#444]"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setSettings({ ...settings, fontSize: "large" })}
              className={`px-2 py-1 rounded-md text-[10px] ${
                settings.fontSize === "large"
                  ? "bg-accent-purple text-white"
                  : "bg-[#333] text-gray-300 hover:bg-[#444]"
              }`}
            >
              Large
            </button>
          </div>
        </div>

        {/* Accent Color */}
        <div className="mb-3">
          <h3 className="text-[10px] font-medium text-gray-300 mb-1.5">Accent Color</h3>
          <div className="grid grid-cols-4 gap-1.5 mb-1.5">
            {PRESET_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => setSettings({ ...settings, accentColor: color.value })}
                className="relative w-full aspect-square rounded-md flex items-center justify-center"
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {settings.accentColor === color.value && <Check size={12} className="text-white drop-shadow-md" />}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-1.5">
            <label className="text-[10px] text-gray-300">Custom:</label>
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
              className="w-6 h-6 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.accentColor}
              onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
              className="bg-input-bg text-white p-1 rounded border border-[#555] text-[10px] flex-1"
              placeholder="#8a63d2"
            />
          </div>
        </div>

        {/* Custom Theme (Advanced) */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-[10px] font-medium text-gray-300">Custom Theme</h3>
            <button
              onClick={() => setSettings({ ...settings, theme: "custom" })}
              className={`px-1.5 py-0.5 rounded-md text-[9px] flex items-center gap-1 ${
                settings.theme === "custom" ? "bg-accent-purple text-white" : "bg-[#333] text-gray-300 hover:bg-[#444]"
              }`}
            >
              <Palette size={10} />
              <span>Enable Custom</span>
            </button>
          </div>

          <div className={`space-y-1.5 ${settings.theme !== "custom" ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="grid grid-cols-3 gap-1.5">
              <div>
                <label className="text-[9px] text-gray-400 block mb-0.5">Background</label>
                <div className="flex items-center space-x-1">
                  <input
                    type="color"
                    value={settings.customBg || "#121212"}
                    onChange={(e) => setSettings({ ...settings, customBg: e.target.value })}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.customBg || "#121212"}
                    onChange={(e) => setSettings({ ...settings, customBg: e.target.value })}
                    className="bg-input-bg text-white p-0.5 rounded border border-[#555] text-[9px] w-full"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] text-gray-400 block mb-0.5">Text</label>
                <div className="flex items-center space-x-1">
                  <input
                    type="color"
                    value={settings.customText || "#ffffff"}
                    onChange={(e) => setSettings({ ...settings, customText: e.target.value })}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.customText || "#ffffff"}
                    onChange={(e) => setSettings({ ...settings, customText: e.target.value })}
                    className="bg-input-bg text-white p-0.5 rounded border border-[#555] text-[9px] w-full"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] text-gray-400 block mb-0.5">Accent</label>
                <div className="flex items-center space-x-1">
                  <input
                    type="color"
                    value={settings.customAccent || settings.accentColor}
                    onChange={(e) => setSettings({ ...settings, customAccent: e.target.value })}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.customAccent || settings.accentColor}
                    onChange={(e) => setSettings({ ...settings, customAccent: e.target.value })}
                    className="bg-input-bg text-white p-0.5 rounded border border-[#555] text-[9px] w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-3">
          <h3 className="text-[10px] font-medium text-gray-300 mb-1.5">Preview</h3>
          <div
            className="p-2 rounded-md border"
            style={{
              backgroundColor:
                settings.theme === "light"
                  ? "#f5f5f5"
                  : settings.theme === "custom" && settings.customBg
                    ? settings.customBg
                    : "#1e1e1e",
              color:
                settings.theme === "light"
                  ? "#333333"
                  : settings.theme === "custom" && settings.customText
                    ? settings.customText
                    : "#ffffff",
              borderColor: settings.theme === "light" ? "#d4d4d4" : "#333333",
            }}
          >
            <div className="flex items-center gap-1 mb-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: settings.accentColor }}></div>
              <span
                className="font-medium text-[10px]"
                style={{
                  color:
                    settings.theme === "custom" && settings.customAccent ? settings.customAccent : settings.accentColor,
                }}
              >
                Accent Color
              </span>
            </div>
            <p
              className="text-[9px]"
              style={{
                fontSize:
                  settings.fontSize === "small" ? "0.75rem" : settings.fontSize === "large" ? "0.875rem" : "0.8125rem",
              }}
            >
              Text preview
            </p>
            <button
              className="mt-1 px-1.5 py-0.5 rounded-md text-[9px]"
              style={{
                backgroundColor: settings.accentColor,
                color: "#ffffff",
              }}
            >
              Button
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 flex justify-end gap-1.5">
          <button
            onClick={onClose}
            className="px-2 py-0.5 text-[10px] bg-[#333] text-white rounded transition-all duration-200 hover:bg-[#444] hover:shadow-[0_0_5px_rgba(138,99,210,0.3)] active:transform active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-2 py-0.5 text-[10px] bg-accent-purple text-white rounded transition-all duration-200 hover:bg-purple-hover hover:shadow-[0_0_5px_rgba(138,99,210,0.5)] active:transform active:scale-95"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

interface ThemeOptionProps {
  icon: React.ReactNode
  label: string
  isSelected: boolean
  onClick: () => void
}

const ThemeOption = ({ icon, label, isSelected, onClick }: ThemeOptionProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-1.5 rounded-md border transition-all ${
        isSelected
          ? "bg-accent-purple bg-opacity-10 border-accent-purple text-accent-purple"
          : "bg-[#333] border-[#444] text-gray-300 hover:bg-[#444]"
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-[9px]">{label}</span>
    </button>
  )
}
