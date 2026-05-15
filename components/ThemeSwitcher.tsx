'use client'

import { useState, useEffect } from 'react'

type Theme = 'blue' | 'green'

const THEMES: { id: Theme; label: string; bg: string; ring: string }[] = [
  { id: 'blue',  label: 'Blau',  bg: '#1d6ec8', ring: '#1d6ec8' },
  { id: 'green', label: 'Grün',  bg: '#15803d', ring: '#15803d' },
]

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('blue')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('we-theme') as Theme | null
    const active = saved ?? 'blue'
    setTheme(active)
    applyTheme(active)
    setMounted(true)
  }, [])

  function applyTheme(t: Theme) {
    if (t === 'green') {
      document.documentElement.setAttribute('data-theme', 'green')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  function switchTheme(t: Theme) {
    setTheme(t)
    applyTheme(t)
    localStorage.setItem('we-theme', t)
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 rounded-full px-4 py-2.5">
      <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Farbvariante:</span>
      <div className="flex items-center gap-2">
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => switchTheme(t.id)}
            title={t.label}
            style={{
              backgroundColor: t.bg,
              outline: theme === t.id ? `2px solid ${t.ring}` : 'none',
              outlineOffset: '2px',
              transform: theme === t.id ? 'scale(1.2)' : 'scale(1)',
            }}
            className="w-6 h-6 rounded-full transition-all duration-200 hover:scale-110"
          />
        ))}
      </div>
      <span className="text-xs text-gray-400 hidden sm:block">
        {theme === 'blue' ? 'Blau' : 'Grün'}
      </span>
    </div>
  )
}
