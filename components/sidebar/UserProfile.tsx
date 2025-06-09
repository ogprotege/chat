"use client"

import { useState, useRef, useEffect } from "react"
import { Settings2Icon, PaletteIcon, LogOutIcon, MailIcon, ClockIcon, ChevronUpIcon } from "lucide-react"
import { ChatHistoryDrawer } from "./ChatHistoryDrawer"
import { SettingsModal } from "./SettingsModal"
import { AppearanceModal, type AppearanceSettings } from "./AppearanceModal"

interface UserProfileProps {
  onLogout?: () => void
}

export const UserProfile = ({ onLogout }: UserProfileProps) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAppearance, setShowAppearance] = useState(false)
  const [userName, setUserName] = useState("Guest")

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // Get initial name from localStorage if available
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("user_name")
      if (savedName) {
        setUserName(savedName)
      }

      // Listen for settings updates
      const handleSettingsUpdate = (event: CustomEvent) => {
        const { settings } = event.detail
        if (settings && settings.name) {
          setUserName(settings.name || "Guest")
        }
      }

      window.addEventListener("settingsUpdated", handleSettingsUpdate as EventListener)

      return () => {
        window.removeEventListener("settingsUpdated", handleSettingsUpdate as EventListener)
      }
    }
  }, [])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ex314_authenticated")
    }
    if (onLogout) onLogout()
    setIsMenuOpen(false)
    window.location.href = "/login"
  }

  const handleAppearanceSave = (settings: AppearanceSettings) => {
    console.log("Appearance settings saved:", settings)
    setShowAppearance(false)
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full p-4 border-t border-[#444444] flex items-center gap-3 flex-shrink-0 transition-all duration-200 hover:bg-[#2a2a2a] hover:text-accent-purple hover:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple"
        >
          <div className="w-8 h-8 rounded-full bg-[#555555] flex items-center justify-center font-medium text-sm shadow-sm transition-all duration-200 hover:bg-[#666] hover:shadow-[0_0_8px_rgba(138,99,210,0.3)]">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">{userName}</div>
            <div className="text-xs text-gray-500">Guest Session</div>
          </div>
          <ChevronUpIcon
            size={16}
            className={`text-gray-500 transition-transform duration-200 ${isMenuOpen ? "rotate-0" : "rotate-180"}`}
          />
        </button>

        {isMenuOpen && (
          <div className="absolute bottom-full left-0 w-full bg-card-bg border border-[#444444] rounded-t-lg overflow-hidden shadow-lg z-50">
            <button
              className="w-full p-3 flex items-center gap-3 transition-all duration-200 hover:bg-[#2a2a2a] hover:text-accent-purple text-sm active:bg-[#333]"
              onClick={() => {
                setShowDrawer(true)
                setIsMenuOpen(false)
              }}
            >
              <ClockIcon
                size={16}
                className="text-gray-400 transition-all duration-200 group-hover:text-accent-purple"
              />
              <span>Chat History</span>
            </button>
            <button
              className="w-full p-3 flex items-center gap-3 transition-all duration-200 hover:bg-[#2a2a2a] hover:text-accent-purple text-sm active:bg-[#333]"
              onClick={() => {
                setShowSettings(true)
                setIsMenuOpen(false)
              }}
            >
              <Settings2Icon
                size={16}
                className="text-gray-400 transition-all duration-200 group-hover:text-accent-purple"
              />
              <span>Settings</span>
            </button>
            <button
              className="w-full p-3 flex items-center gap-3 transition-all duration-200 hover:bg-[#2a2a2a] hover:text-accent-purple text-sm active:bg-[#333]"
              onClick={() => {
                setShowAppearance(true)
                setIsMenuOpen(false)
              }}
            >
              <PaletteIcon
                size={16}
                className="text-gray-400 transition-all duration-200 group-hover:text-accent-purple"
              />
              <span>Appearance</span>
            </button>
            <a
              href="mailto:notapharisee@ex314.ai"
              className="w-full p-3 flex items-center gap-3 transition-all duration-200 hover:bg-[#2a2a2a] hover:text-accent-purple text-sm active:bg-[#333]"
            >
              <MailIcon
                size={16}
                className="text-gray-400 transition-all duration-200 group-hover:text-accent-purple"
              />
              <span>Contact</span>
            </a>
            <button
              onClick={handleLogout}
              className="w-full p-3 flex items-center gap-3 transition-all duration-200 hover:bg-[#2a2a2a] hover:text-red-400 text-sm text-red-500 border-t border-[#444444] active:bg-[#333]"
            >
              <LogOutIcon size={16} className="transition-all duration-200" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>

      {/* Chat History Drawer */}
      <ChatHistoryDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={(settings) => {
          console.log("Settings saved:", settings)
          setShowSettings(false)
        }}
      />

      {/* Appearance Modal */}
      <AppearanceModal isOpen={showAppearance} onClose={() => setShowAppearance(false)} onSave={handleAppearanceSave} />
    </>
  )
}
