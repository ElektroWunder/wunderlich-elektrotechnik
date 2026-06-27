import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: 'Wartung & E-Check – Klimawartung & DGUV V3 | EN-Kreis',
  description:
    'Wartungsverträge für Klimaanlagen und DGUV-V3-Prüfungen (E-Check) im Ennepe-Ruhr-Kreis. Prüfprotokoll, Betriebssicherheit, Herstellergarantie erhalten.',
}

const klimaWartung = [
  'Reinigung der Wärmetauscher und Filter',
  'Dichtheitsprüfung nach EU 517/2014',
  'Prüfung des Kältemittelkreislaufs',
  'Überprüfung aller Sicherheitsfunktionen',
  'Prüfprotokoll und Wartungsaufkleber',
]

const eCheck = [
  'Sichtprüfung aller elektrischen Betriebsmittel',
  'Messung Isolationswiderstand und Schutzleiter',
  'Prüfung ortsveränderlicher Geräte',
  'Vollständiges Prüfprotokoll (DGUV V3)',
  'Prüfplaketten und Mängelprotokoll',
]

export default function WartungPage() {
  return (
    <>
      <Hero
        headline="Wartung & E-Check – Sicherheit, die bleibt."
        subheadline="Klimaanlagen-Wartung und DGUV-V3-Prüfungen im Ennepe-Ruhr-Kreis. Vollständige Dokumentation und Prüfprotokoll inklusive."
        imageUrl="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80"
        imageAlt="Techniker bei der Wartung – Wunderlich Elektrotechnik"
        badge="Klimawartung · DGUV V3 · EU 517/2014 Dichtheitsprüfung"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-content mb-12">
            <p>
              Eine nicht gewartete Klimaanlage verliert jährlich Effizienz – und riskiert den
              Garantieverlust. Der <strong>E-Check (DGUV V3)</strong> ist für Unternehmen
              gesetzlich verpflichtend. Wir führen beides durch und liefern lückenlose
              Prüfprotokolle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-bold text-primary mb-5">Klimaanlage Wartung</h2>
              <div className="space-y-3">
                {klimaWartung.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary mb-5">E-Check / DGUV V3</h2>
              <div className="space-y-3">
                {eCheck.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTA
        headline="Wartung oder E-Check anfragen"
        subtext="Wartungsvertrag oder einmalige Prüfung – wir erstellen Ihnen ein Angebot."
      />
    </>
  )
}
