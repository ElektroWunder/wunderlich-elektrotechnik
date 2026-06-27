import type { Metadata } from 'next'
import { CheckCircle, Info } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: 'Wärmepumpen – Elektroanschluss & Installation | Witten',
  description:
    'Elektrischer Anschluss und Installation von Wärmepumpen in Witten und Umgebung. Kältemittelzertifiziert Kat. I. Meisterbetrieb Wunderlich Elektrotechnik.',
}

const included = [
  'Elektrischer Anschluss nach VDE 0100',
  'Dimensionierung der Zuleitung und Absicherung',
  'Lastabwurf-Relais nach §14a EnWG (Pflicht)',
  'Steuer- und Signalleitungen',
  'Inbetriebnahme-Unterstützung',
  'Dokumentation und Schaltplan',
]

export default function WaermepumpenPage() {
  return (
    <>
      <Hero
        headline="Wärmepumpen – fachgerechter Elektroanschluss."
        subheadline="Den elektrischen Anschluss Ihrer Wärmepumpe übernehmen wir normgerecht und zuverlässig – in Witten und Umgebung. Kältemittelzertifiziert nach EU 517/2014."
        imageUrl="https://images.unsplash.com/photo-1558618047-f7c91b8f6d97?w=1920&q=80"
        imageAlt="Wärmepumpe Außeneinheit – Wunderlich Elektrotechnik"
        badge="Elektroanschluss · §14a EnWG · Kältemittelzertifiziert"
      />

      <section className="py-10 bg-blue-50 border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-accent shrink-0 mt-0.5" />
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Unser Beitrag bei Wärmepumpen:</strong> Wir sind für den elektrischen Anschluss
              zuständig – Zuleitung, Absicherung, Steuerung, Lastabwurf. Die Heizungsseite
              (Rohrleitungen, hydraulischer Abgleich, Pufferspeicher) wird vom Heizungsbauer übernommen.
              Bei Bedarf empfehlen wir Ihnen einen geeigneten Partner.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-content mb-12">
            <p>
              Eine Wärmepumpe ist ein leistungsstarker Verbraucher – der Anschluss muss entsprechend
              dimensioniert sein. Pflicht seit 2024: <strong>§14a-EnWG-Konformität</strong> mit
              steuerbarem Schütz und Anmeldung beim Netzbetreiber. Wir erledigen das normgerecht.
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
        headline="Wärmepumpe anschließen lassen"
        subtext="Wir schauen es uns vor Ort an und erstellen ein schriftliches Angebot für den Elektroanschluss."
      />
    </>
  )
}
