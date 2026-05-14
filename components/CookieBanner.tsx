'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:bottom-6 md:left-6 md:right-auto md:max-w-md animate-slide-up">
      <div className="bg-primary text-white p-5 rounded-t-2xl md:rounded-2xl shadow-2xl">
        <p className="text-sm text-gray-300 leading-relaxed mb-4">
          Diese Website verwendet ausschließlich technisch notwendige Cookies. Für Google Maps
          benötigen wir Ihre Zustimmung. Weitere Infos in der{' '}
          <Link href="/datenschutz" className="text-accent hover:underline">
            Datenschutzerklärung
          </Link>
          .
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="flex-1 bg-accent hover:bg-accent-dark text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
          >
            Akzeptieren
          </button>
          <button
            onClick={decline}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors border border-white/20"
          >
            Ablehnen
          </button>
        </div>
      </div>
    </div>
  )
}
