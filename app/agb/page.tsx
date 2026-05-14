import type { Metadata } from 'next'
import { AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AGB – Allgemeine Geschäftsbedingungen',
  description: 'Allgemeine Geschäftsbedingungen von Wunderlich Elektrotechnik.',
  robots: { index: false },
}

export default function AgbPage() {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-primary mb-10">
          Allgemeine Geschäftsbedingungen
        </h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10 flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 mb-1">Hinweis</p>
            <p className="text-amber-800 text-sm leading-relaxed">
              Die Allgemeinen Geschäftsbedingungen werden aktuell durch einen Rechtsbeistand
              ausgearbeitet und in Kürze hier veröffentlicht. Bis dahin gelten die gesetzlichen
              Regelungen des BGB und der VOB/B für alle Aufträge.
            </p>
          </div>
        </div>

        <div className="prose-content">
          <p className="text-gray-500">
            Für Anfragen zu bestehenden Vertragsgrundlagen wenden Sie sich bitte direkt an:
          </p>
          <p>
            <strong>Wunderlich Elektrotechnik</strong><br />
            Sebastian Wunderlich<br />
            Casinostraße 2 · 58452 Witten<br />
            Telefon: <a href="tel:+49XXXXXXXXXX" className="text-accent">+49 XXX XXXXXXXX</a>
          </p>
        </div>
      </div>
    </div>
  )
}
