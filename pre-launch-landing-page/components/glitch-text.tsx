"use client"

import { useState, useEffect, type ReactNode } from "react"

interface GlitchTextProps {
  children: ReactNode
  interval?: number
  intensity?: number
}

export default function GlitchText({ children, interval = 2000, intensity = 0.3 }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 200)
    }, interval)

    return () => clearInterval(glitchInterval)
  }, [interval])

  return (
    <span className="relative inline-block">
      <span className={isGlitching ? "opacity-0" : "opacity-100"}>{children}</span>

      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 text-[#ff2d55]"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
              transform: `translate(${Math.random() * intensity * 10 - 5}px, ${Math.random() * intensity * 5 - 2.5}px)`,
            }}
          >
            {children}
          </span>
          <span
            className="absolute top-0 left-0 text-[#00ff66]"
            style={{
              clipPath: "polygon(0 45%, 100% 45%, 100% 100%, 0 100%)",
              transform: `translate(${Math.random() * intensity * 10 - 5}px, ${Math.random() * intensity * 5 - 2.5}px)`,
            }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  )
}
