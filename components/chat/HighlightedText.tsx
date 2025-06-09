interface HighlightedTextProps {
  text: string
  searchTerm: string
}

export function HighlightedText({ text, searchTerm }: HighlightedTextProps) {
  if (!searchTerm.trim()) {
    return <>{text}</>
  }

  const parts = text.split(new RegExp(`(${searchTerm})`, "gi"))

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = part.toLowerCase() === searchTerm.toLowerCase()
        return isMatch ? (
          <span key={i} className="bg-yellow-500/30 text-white font-medium px-0.5 rounded">
            {part}
          </span>
        ) : (
          part
        )
      })}
    </>
  )
}
