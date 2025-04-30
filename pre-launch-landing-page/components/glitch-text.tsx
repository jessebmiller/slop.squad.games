"use client"

import { useState, useEffect, type ReactNode } from "react"

interface GlitchTextProps {
  children: ReactNode
  interval?: number
  intensity?: number
}

interface GlitchWord {
  text: string
  isGlitching: boolean
  font: string
  color: string
  transform: string
}

export default function GlitchText({ children, interval = 2000, intensity = 0.3 }: GlitchTextProps) {
  const [words, setWords] = useState<GlitchWord[]>([])
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    // Initialize words array
    const text = children?.toString() || ""
    const initialWords = text.split(" ").map(word => ({
      text: word,
      isGlitching: false,
      font: "font-rubik-spray-paint",
      color: "text-white",
      transform: "translate(0, 0)"
    }))
    setWords(initialWords)
  }, [children])

  const glitchFonts = [
    "font-rubik-glitch",
    "font-rubik-microbe",
    "font-rubik-spray-paint",
  ]

  const glitchColors = [
    "text-[#ff00ff]",
    "text-[#00ffff]",
  ]

  const getRandomTransform = () => {
    return `translate(${Math.random() * intensity * 10 - 5}px, ${Math.random() * intensity * 5 - 2.5}px)`
  }

  const resetToBaseline = () => {
    setWords(prevWords => 
      prevWords.map(word => ({
        ...word,
        isGlitching: false,
        font: "font-rubik-spray-paint",
        color: "text-white",
        transform: "translate(0, 0)"
      }))
    )
  }

  const performGlitch = () => {
    // Number of glitch stages (1-5)
    const numStages = Math.floor(Math.random() * 5) + 1
    let currentStage = 0

    const glitchStage = () => {
      if (currentStage >= numStages) {
        setIsGlitching(false)
        resetToBaseline()
        return
      }

      // Number of words to affect (1-3)
      const numWordsToAffect = Math.floor(Math.random() * 3) + 1
      const affectedIndices = new Set<number>()

      // Select random words to affect
      while (affectedIndices.size < numWordsToAffect) {
        affectedIndices.add(Math.floor(Math.random() * words.length))
      }

      setWords(prevWords => 
        prevWords.map((word, index) => {
          if (affectedIndices.has(index)) {
            return {
              ...word,
              isGlitching: true,
              font: glitchFonts[Math.floor(Math.random() * glitchFonts.length)],
              color: glitchColors[Math.floor(Math.random() * glitchColors.length)],
              transform: getRandomTransform()
            }
          }
          return word
        })
      )

      currentStage++
      
      // Random delay between stages (50-150ms)
      const nextStageDelay = 50 + Math.random() * 100
      setTimeout(glitchStage, nextStageDelay)
    }

    glitchStage()
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const scheduleNextGlitch = () => {
      // Random interval between 1s and 6s
      const nextInterval = 1000 + Math.random() * 5000
      timeoutId = setTimeout(() => {
        setIsGlitching(true)
        performGlitch()
        scheduleNextGlitch()
      }, nextInterval)
    }

    scheduleNextGlitch()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [interval, words.length])

  return (
    <span className="relative inline-block">
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block ${word.font} ${word.color}`}
          style={{ transform: word.transform }}
        >
          {word.text}
          {index < words.length - 1 && " "}
        </span>
      ))}
    </span>
  )
}
