'use client'

import { useState, useEffect } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'

export default function GoogleMapsEmbed() {
  const [consent, setConsent] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent')
    setConsent(stored === 'accepted')
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setConsent(true)
  }

  if (!consent) {
    return (
      <div className="w-full h-80 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-4 border border-gray-200 p-8 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-primary mb-1">Google Maps anzeigen</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Für die Kartenanzeige werden Daten an Google übermittelt. Bitte stimmen Sie zu, um
            die Karte zu laden.
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          Karte laden
        </button>
        <a
          href="https://maps.google.com/?q=Casinostraße+2,+58452+Witten"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-accent hover:underline"
        >
          In Google Maps öffnen <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    )
  }

  return (
    <div className="w-full h-80 rounded-xl overflow-hidden border border-gray-200">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2479.5!2d7.3527!3d51.4397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDI2JzE5LjkiTiA3wrAyMScwOS43IkU!5e0!3m2!1sde!2sde!4v1"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Standort Wunderlich Elektrotechnik, Casinostraße 2, 58452 Witten"
      />
    </div>
  )
}
