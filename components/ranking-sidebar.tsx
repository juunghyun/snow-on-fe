"use client"

import { X, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RankingCity {
  cityName: string
  score: number
}

interface RankingSidebarProps {
  cities: RankingCity[]
  isOpen: boolean
  onClose: () => void
}

export function RankingSidebar({ cities, isOpen, onClose }: RankingSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 glass-strong shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="bg-white rounded-xl px-4 py-2">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sky-500" />
                Top 5 인기 검색 도시
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Ranking list */}
          <div className="flex-1 space-y-3">
            {cities.map((city, index) => (
              <div key={city.cityName} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                      index === 0
                        ? "bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-200"
                        : index === 1
                          ? "bg-gradient-to-br from-sky-300 to-blue-400 text-white shadow-md shadow-sky-100"
                          : index === 2
                            ? "bg-gradient-to-br from-sky-200 to-blue-300 text-white shadow-md shadow-sky-50"
                            : index === 3
                              ? "bg-gradient-to-br from-sky-100 to-blue-200 text-sky-700"
                              : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{city.cityName}</p>
                    <p className="text-sm text-muted-foreground">검색 횟수: {city.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
