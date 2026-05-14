import type { Metadata } from 'next'
import { CheckCircle, Info } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'
import FAQ from '@/components/FAQ'

export const metadata: Metadata = {
  title: 'Wärmepumpen – Elektroanschluss & Installation | Witten',
  description:
    'Elektrischer Anschluss und Installation von Wärmepumpen in Witten und Umgebung. Kältemittelzertifiziert Kat. I. Meisterbetrieb Wunderlich Elektrotechnik.',
}

const included = [
  'Vor-Ort-Besichtigung',
  'Elektrischer Anschluss der Wärmepumpe nach VDE 0100',
  'Dimensionierung der Zuleitung und Absicherung',
  'Lastabwurf-Relais nach §14a EnWG (Pflicht)',
  'Steuer- und Signalleitungen',
  'Inbetriebnahme-Unterstützung',
  'Dokumentation und Schaltplan',
]

const faqs = [
  {
    question: 'Was übernehmen Sie bei einer Wärmepumpeninstallation?',
    answer:
      'Ich übernehme den elektrischen Teil: die Zuleitung vom Verteilerkasten zur Wärmepumpe, die Absicherung, Steuer- und Kommunikationsleitungen sowie den Lastabwurf nach §14a EnWG. Die Heizungsseite (Rohrleitungen, Heizkörper, Speicher) ist Sache des Heizungsbauers – da arbeite ich gerne mit einem Partner zusammen.',
  },
  {
    question: 'Was ist der Lastabwurf nach §14a EnWG?',
    answer:
      'Wärmepumpen ab einer bestimmten Leistung müssen nach §14a EnWG steuerbar sein – der Netzbetreiber darf die Leistung in Engpasssituationen kurzzeitig drosseln. Dafür ist ein geeignetes Schütz oder Lastabwurf-Relais erforderlich. Ich installiere das normgerecht und melde die Anlage beim Netzbetreiber an.',
  },
  {
    question: 'Übernehmen Sie auch die Förderberatung (BAFA)?',
    answer:
      'Nein – Förderanträge und Förderberatung sind nicht mein Schwerpunkt. Dafür wenden Sie sich am besten an einen Heizungsbauer oder Energieberater. Ich stelle Ihnen die handwerkliche Fachunternehmererklärung für den Elektroanschluss aus, die Sie für die Förderung benötigen.',
  },
  {
    question: 'Können Sie auch den hydraulischen Abgleich durchführen?',
    answer:
      'Nein – hydraulischer Abgleich ist ein heizungsseitiger Vorgang und nicht mein Fachgebiet. Das gehört in die Hände des Heizungsbauers.',
  },
]

export default function WaermepumpenPage() {
  return (
    <>
      <Hero
        headline="Wärmepumpen – fachgerechter Elektroanschluss."
        subheadline="Den elektrischen Anschluss Ihrer Wärmepumpe übernehme ich normgerecht und zuverlässig – in Witten und Umgebung. Kältemittelzertifiziert nach EU 517/2014."
        imageUrl="https://images.unsplash.com/photo-1558618047-f7c91b8f6d97?w=1920&q=80"
        imageAlt="Wärmepumpe Außeneinheit – Wunderlich Elektrotechnik"
        badge="Elektroanschluss · §14a EnWG · Kältemittelzertifiziert"
      />

      {/* Hinweisbox */}
      <section className="py-10 bg-blue-50 border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-accent shrink-0 mt-0.5" />
            <p className="text-gray-700 text-sm leading-relaxed">
              <strong>Mein Beitrag bei Wärmepumpen:</strong> Ich bin für den elektrischen Anschluss
              zuständig – Zuleitung, Absicherung, Steuerung, Lastabwurf. Die Heizungsseite
              (Rohrleitungen, hydraulischer Abgleich, Pufferspeicher) wird vom Heizungsbauer übernommen.
              Bei Bedarf empfehle ich Ihnen einen geeigneten Partner.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-content">
          <h2>Elektroanschluss – normgerecht und sicher</h2>
          <p>
            Eine Wärmepumpe ist ein leistungsstarker Verbraucher. Der Anschluss ans Hausnetz
            muss entsprechend dimensioniert sein: richtige Leitungsquerschnitte, korrekte
            Absicherung, Schutzorgane – alles nach <strong>VDE 0100</strong>. Ich verlege die
            Zuleitung, baue die Absicherung in den Verteilerkasten ein und stelle alle
            Steuer- und Kommunikationsleitungen zwischen Wärmepumpe und Regelung her.
          </p>
          <p>
            Pflicht ist seit 2024 außerdem die <strong>§14a-EnWG-Konformität</strong>: Wärmepumpen
            müssen steuerbar installiert werden, damit der Netzbetreiber die Leistung in
            Spitzenlastzeiten kurzzeitig reduzieren kann. Ich installiere das passende Schütz
            und erledige die Anmeldung beim Netzbetreiber.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-10 text-center">Was der Auftrag umfasst</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {included.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqs} title="Fragen zum Wärmepumpen-Elektroanschluss" />

      <CTA
        headline="Wärmepumpe anschließen lassen"
        subtext="Ich schaue es mir vor Ort an und erstelle ein schriftliches Angebot für den Elektroanschluss."
      />
    </>
  )
}
