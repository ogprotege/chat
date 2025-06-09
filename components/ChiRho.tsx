import Image from "next/image"

interface ChiRhoProps {
  size?: number
  className?: string
}

export function ChiRho({ size = 24, className = "" }: ChiRhoProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image src="/images/chi-rho.png" alt="Chi Rho" width={size} height={size} className="object-contain" />
    </div>
  )
}
