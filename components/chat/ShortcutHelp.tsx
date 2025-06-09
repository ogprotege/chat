"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

// Define the shortcuts for documentation and implementation
export const KEYBOARD_SHORTCUTS = {
  SEARCH: { keys: ["Ctrl", "F"], description: "Search chat" },
  NEW_CHAT: { keys: ["Ctrl", "N"], description: "New chat" },
  EXPORT: { keys: ["Ctrl", "E"], description: "Export chat" },
  HELP: { keys: ["Ctrl", "/"], description: "Show keyboard shortcuts" },
  CLEAR: { keys: ["Alt", "C"], description: "Clear current chat" },
  NAVIGATE_UP: { keys: ["Alt", "↑"], description: "Previous message" },
  NAVIGATE_DOWN: { keys: ["Alt", "↓"], description: "Next message" },
}

export function ShortcutHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Keyboard shortcuts"
          data-shortcut-help
          className="text-gray-custom hover:text-white hover:bg-[#333] transition-colors rounded-md"
        >
          <HelpCircle size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card-bg border-[#444] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-1">
          {Object.values(KEYBOARD_SHORTCUTS).map((shortcut, index) => (
            <div key={index} className="flex justify-between py-2 border-b border-[#333] last:border-0">
              <span>{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2 py-1 text-xs font-semibold bg-[#333] rounded border border-[#444]"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
