import type React from "react"
import type { Metadata } from "next"
import { ChatProvider } from "@/context/ChatContext"
import "./globals.css"

export const metadata: Metadata = {
  title: "ex314.ai | Catholic Theological AI Assistant",
  description: "A Catholic theological AI assistant built with React and Next.js",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                const accentColor = localStorage.getItem('accent_color') || '#8a63d2';
                const fontSize = localStorage.getItem('font_size') || 'normal';
                
                // Apply theme class to body
                if (theme === 'light') {
                  document.documentElement.classList.add('light-theme');
                } else if (theme === 'custom') {
                  document.documentElement.classList.add('custom-theme');
                } else {
                  document.documentElement.classList.add('dark-theme');
                }
                
                // Apply CSS variables
                const root = document.documentElement;
                root.style.setProperty('--accent-purple', accentColor);
                
                // Apply font size
                const fontSizeMap = {
                  small: '0.875rem',
                  normal: '1rem',
                  large: '1.125rem'
                };
                root.style.setProperty('--base-font-size', fontSizeMap[fontSize] || '1rem');
                
                // Apply custom theme if needed
                if (theme === 'custom') {
                  const customBg = localStorage.getItem('custom_bg');
                  const customText = localStorage.getItem('custom_text');
                  
                  if (customBg) {
                    root.style.setProperty('--card-bg', customBg);
                    root.style.setProperty('--dark-bg', customBg);
                    root.style.setProperty('--dark-card-bg', customBg);
                  }
                  
                  if (customText) {
                    root.style.setProperty('--gray-custom', customText);
                  }
                }
              } catch (e) {
                console.error('Error applying theme:', e);
              }
            })();
          `,
          }}
        />
      </head>
      <body>
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  )
}
