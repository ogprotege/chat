interface ChiRhoLogoProps {
  size?: number
  className?: string
}

export function ChiRhoLogo({ size = 24, className = "" }: ChiRhoLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="#8a63d2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2 17L12 22L22 17" stroke="#8a63d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12L12 17L22 12" stroke="#8a63d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
