import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: 'Klimaanlagen – Installation, Wartung & Reparatur | Witten',
  description:
    'Splitklimaanlagen installieren, warten und reparieren lassen in Witten und Umgebung. Daikin, Mitsubishi, Toshiba – kältemittelzertifiziert Kat. I. Meisterbetrieb.',
  openGraph: {
    title: 'Klimaanlagen – Wunderlich Elektrotechnik Witten',
    description: 'Installation, Wartung und Reparatur von Splitklimaanlagen in Witten. Daikin, Mitsubishi, Toshiba. Kältemittelzertifiziert.',
  },
}

const included = [
  'Vor-Ort-Besichtigung und Beratung',
  'Installation von Innen- und Außengerät',
  'Verlegung der Kältemittelleitungen',
  'Elektroanschluss nach VDE 0100',
  'Befüllung mit Kältemittel (EU 517/2014, Kat. I)',
  'Inbetriebnahme, Einweisung und Protokoll',
  'Wartung und Reparatur bestehender Anlagen',
]

export default function KlimaanlagenPage() {
  return (
    <>
      <Hero
        headline="Klimaanlagen – sauber installiert, zuverlässig gewartet."
        subheadline="Split- und Multisplitanlagen von Daikin, Mitsubishi und Toshiba. Installation, Wartung und Reparatur in Witten und Umgebung."
        imageUrl="https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1920&q=80"
        imageAlt="Klimaanlage Innengerät – Wunderlich Elektrotechnik Witten"
        badge="Daikin · Mitsubishi · Toshiba · EU 517/2014 zertifiziert"
        overlay="dark"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-content mb-12">
            <p>
              Wir installieren, warten und reparieren <strong>Split- und Multisplitanlagen</strong> –
              vom einzelnen Schlafzimmer bis zur kleinen Gewerbeeinheit. Mit dem{' '}
              <strong>Kältemittelschein Kategorie I</strong> nach EU 517/2014 dürfen wir alle
              gängigen Kältemittel fachgerecht handhaben. Jede Anlage wird vollständig dokumentiert.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {included.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        headline="Klimaanlage anfragen"
        subtext="Angebot nach Vor-Ort-Besichtigung. Wir melden uns innerhalb von 24 Stunden."
        primaryLabel="Jetzt anfragen"
      />
    </>
  )
}
