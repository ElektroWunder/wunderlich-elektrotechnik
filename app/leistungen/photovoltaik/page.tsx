import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: 'Photovoltaik – Elektroanschluss & Installation | Witten',
  description:
    'Elektrische Installation von Photovoltaikanlagen in Witten und Umgebung. Wechselrichter, Speicher, Netzanmeldung. Meisterbetrieb Wunderlich Elektrotechnik.',
}

const included = [
  'Elektrische Montage und Verkabelung der Module',
  'Wechselrichter-Installation und Anschluss',
  'Einbindung eines Batteriespeichers (optional)',
  'Einbindung ins Zählerkonzept der Hausinstallation',
  'Anmeldung beim Netzbetreiber und Bundesnetzagentur (MaStR)',
  'Inbetriebnahme, Monitoring-Einrichtung und Dokumentation',
]

export default function PhotovoltaikPage() {
  return (
    <>
      <Hero
        headline="Photovoltaik – Ihren Strom selbst produzieren."
        subheadline="Elektrische Installation von PV-Anlagen in Witten und Umgebung. Von der Modulverkabelung bis zur Netzanmeldung – alles aus einer Hand."
        imageUrl="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80"
        imageAlt="Photovoltaik-Anlage auf Hausdach – Wunderlich Elektrotechnik"
        badge="PV-Anlagen · Batteriespeicher · Netzanmeldung inklusive"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-content mb-12">
            <p>
              Wir übernehmen den <strong>elektrischen Teil</strong> Ihrer PV-Anlage vollständig:
              Modulanschluss, Wechselrichter, DC- und AC-Leitungen, Speicheranbindung und
              Netzanmeldung. Kein Dachdeckerbetrieb, kein Gerüstbau – aber alles was Strom betrifft.
              Eine Kombination mit einer Wallbox planen wir von Anfang an aufeinander abgestimmt.
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
        headline="PV-Anlage anfragen"
        subtext="Vor-Ort-Einschätzung – wir sagen Ihnen ehrlich, was wir umsetzen können."
      />
    </>
  )
}
