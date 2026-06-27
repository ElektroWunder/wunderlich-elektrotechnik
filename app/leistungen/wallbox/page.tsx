import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: 'Wallbox – E-Auto laden mit 11 kW & 22 kW | EN-Kreis',
  description:
    'Wallbox Installation im Ennepe-Ruhr-Kreis: 11 kW und 22 kW AC-Ladelösungen, eichrechtskonforme Abrechnung, Lastmanagement. KfW-förderfähig. Meisterbetrieb.',
}

const included = [
  'Prüfung der vorhandenen Hausinstallation',
  'Verlegung der Zuleitung nach VDE 0100-722',
  'Montage und Inbetriebnahme der Wallbox',
  'DC-FI-Schutz (Typ B) und Absicherung',
  'Netzbetreiber-Anmeldung ab 11 kW (gesetzlich Pflicht)',
  'Lastmanagement für Mehrfachinstallationen',
]

export default function WallboxPage() {
  return (
    <>
      <Hero
        headline="Wallbox – Ihr E-Auto zuverlässig laden."
        subheadline="11 und 22 kW AC-Ladelösungen für Eigenheimbesitzer und Gewerbebetriebe im Ennepe-Ruhr-Kreis. Netzbetreiber-Anmeldung und §-14a-Konformität inklusive."
        imageUrl="https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=1920&q=80"
        imageAlt="Wallbox E-Auto laden – Wunderlich Elektrotechnik"
        badge="11 kW & 22 kW · §14a EnWG · Eichrechtskonforme Abrechnung"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-content mb-12">
            <p>
              Eine Haushaltssteckdose ist für den Dauerbetrieb als Ladepunkt nicht ausgelegt.
              Wir installieren Wallboxen normgerecht nach <strong>VDE 0100-722</strong> –
              mit korrekter Absicherung, vorgeschriebenem DC-FI-Schutz und der gesetzlich
              nötigen Netzbetreiber-Anmeldung ab 11 kW.
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
        headline="Wallbox anfragen"
        subtext="Beschreiben Sie kurz Ihre Situation – wir erstellen Ihnen rasch ein konkretes Angebot."
      />
    </>
  )
}
