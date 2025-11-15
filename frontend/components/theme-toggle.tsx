'use client'

import React, { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    if (!mounted) return
    const html = document.documentElement
    html.classList.toggle('dark')
    setIsDark(!isDark)
  }

  if (!mounted) return null

  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleTheme}
      className="w-10 h-10"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}
