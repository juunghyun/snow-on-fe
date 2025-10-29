"use client"

import { useEffect, useState } from "react"

interface Snowflake {
  id: number
  left: number
  animationDuration: number
  size: number
  delay: number
  variant: "normal" | "alt"
}

export function SnowfallBackground() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  useEffect(() => {
    const flakes: Snowflake[] = []
    for (let i = 0; i < 50; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 10 + Math.random() * 20,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 10,
        variant: Math.random() > 0.5 ? "normal" : "alt",
      })
    }
    setSnowflakes(flakes)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white/70"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animation: `${flake.variant === "normal" ? "snowfall" : "snowfall-alt"} ${flake.animationDuration}s linear infinite`,
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
