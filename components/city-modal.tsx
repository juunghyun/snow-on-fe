"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CityModalProps {
  cityName: string
  weatherStatus: string
  isOpen: boolean
  onClose: () => void
}

export function CityModal({ cityName, weatherStatus, isOpen, onClose }: CityModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />

      {/* Modal content */}
      <div
        className="relative glass-strong rounded-3xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button variant="ghost" size="icon" className="absolute top-4 right-4 hover:bg-white/20" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>

        {/* Content with opaque background for readability */}
        <div className="bg-white rounded-2xl p-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">{cityName}</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            은(는), 현재 <span className="font-semibold text-foreground">{weatherStatus}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
