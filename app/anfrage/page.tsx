import type { Metadata } from 'next'
import AnfrageAssistent from '@/components/AnfrageAssistent'

export const metadata: Metadata = {
  title: 'Anfrageassistent – Angebot konfigurieren | Wunderlich Elektrotechnik',
  description:
    'In wenigen Schritten zur passenden Anfrage: Leistung wählen, Details angeben, Kontaktdaten hinterlassen – wir melden uns innerhalb von 24 Stunden.',
}

export default function AnfragePage() {
  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-3">Anfrageassistent</h1>
          <p className="text-gray-500 text-lg">
            In 3 Schritten zur passenden Anfrage – wir melden uns innerhalb von 24 Stunden.
          </p>
        </div>
        <AnfrageAssistent />
      </div>
    </div>
  )
}
