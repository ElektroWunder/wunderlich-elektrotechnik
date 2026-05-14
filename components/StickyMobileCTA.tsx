'use client'

import { Phone } from 'lucide-react'

export default function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="bg-white border-t border-gray-200 shadow-2xl px-4 py-3">
        <a
          href="tel:+49XXXXXXXXXX"
          className="flex items-center justify-center gap-3 bg-accent hover:bg-accent-dark text-white w-full py-3.5 rounded-xl font-bold text-base transition-colors"
        >
          <Phone className="w-5 h-5" />
          Jetzt anrufen: +49 XXX XXXXXXXX
        </a>
      </div>
    </div>
  )
}
