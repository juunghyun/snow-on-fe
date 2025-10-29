"use client"

import { useEffect, useState } from "react"

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onComplete, 500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!show) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <div
        className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-sky-400 via-blue-300 to-cyan-200"
        style={{
          animation: "crystallize 2s ease-out forwards",
          textShadow: "0 0 40px rgba(56, 189, 248, 0.3)",
        }}
      >
        눈 ON
      </div>
    </div>
  )
}
