"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="glass-strong rounded-2xl p-2 shadow-xl">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="도시 이름을 검색하세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-white/80 border-0 text-lg h-12 focus-visible:ring-sky-300"
          />
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-sky-400 to-blue-400 hover:from-sky-500 hover:to-blue-500 text-white px-8"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </form>
  )
}
