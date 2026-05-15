import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'
import FAQ from '@/components/FAQ'

export const metadata: Metadata = {
  title: 'Photovoltaik – Elektroanschluss & Installation | Witten',
  description:
    'Elektrische Installation von Photovoltaikanlagen in Witten und Umgebung. Wechselrichter, Speicher, Netzanmeldung. Meisterbetrieb Wunderlich Elektrotechnik.',
}

const included = [
  'Einschätzung der möglichen Belegungsgröße (kWp) auf Ihrer Dachfläche',
  'Elektrische Montage und Verkabelung der Module',
  'Wechselrichter-Installation und Anschluss',
  'Einbindung eines Batteriespeichers (optional)',
  'Einbindung in die Hausinstallation (Zählerkonzept)',
  'Anmeldung beim Netzbetreiber und Bundesnetzagentur (MaStR)',
  'Einspeisezähler und Einspeisemanagement',
  'Inbetriebnahme und Einweisung ins Monitoring',
  'Vollständige Dokumentation',
]

const steps = [
  {
    step: '01',
    title: 'Vor-Ort-Einschätzung',
    description:
      'Wir schauen uns Ihre Dachfläche an – Ausrichtung, Neigung, mögliche Verschattung – und schätzen, wie viele Module und welche Leistung (kWp) realistisch umsetzbar sind. Eine statische Dachbewertung ist nicht unser Fachgebiet; wenn nötig, ziehen wir einen Statiker hinzu.',
  },
  {
    step: '02',
    title: 'Angebot und Komponentenwahl',
    description:
      'Sie erhalten ein Angebot für die elektrische Installation. Wir empfehlen Ihnen Modultypen und Wechselrichter – die endgültige Wahl liegt bei Ihnen.',
  },
  {
    step: '03',
    title: 'Elektrische Installation',
    description:
      'Wir übernehmen die komplette Elektroinstallation: Modul- und Wechselrichteranschluss, DC- und AC-Leitungen, Zählerkonzept, Speicheranbindung. Die Anmeldung beim Netzbetreiber und der MaStR erledigen wir für Sie.',
  },
  {
    step: '04',
    title: 'Inbetriebnahme',
    description:
      'Nach der Netzfreischaltung nehmen wir die Anlage in Betrieb und richten das Monitoring ein, damit Sie die Produktion Ihrer Anlage im Blick behalten.',
  },
]

const faqs = [
  {
    question: 'Was genau übernehmen Sie bei der PV-Installation?',
    answer:
      'Wir übernehmen den elektrischen Teil: Montage und Anschluss der Module, Wechselrichter, DC- und AC-Verkabelung, Speicher, Zählerkonzept, Netzanmeldung. Was wir nicht machen: Dachdeckerarbeiten, statische Berechnungen oder Gerüstbau. Das Aufständerungssystem montieren wir, wenn es ein einfaches System ist – bei komplexeren Dächern arbeiten wir mit Partnern.',
  },
  {
    question: 'Können Sie uns sagen, wie viele Module auf mein Dach passen?',
    answer:
      'Wir können anhand von Dachfläche, Ausrichtung und Neigung einschätzen, wie viele Module sinnvoll platziert werden können und welche Gesamtleistung (kWp) das ergibt. Eine detaillierte Wirtschaftlichkeitsberechnung oder eine professionelle Energieberatung bieten wir nicht an.',
  },
  {
    question: 'Übernehmen Sie die Förderbeantragung?',
    answer:
      'Wir melden die Anlage beim Netzbetreiber und im Marktstammdatenregister (MaStR) an – das ist Pflicht. Steuerliche Beratung oder BAFA-Anträge sind nicht unser Fachgebiet, da wenden Sie sich an einen Steuerberater oder Energieberater.',
  },
  {
    question: 'Können Sie einen Batteriespeicher nachträglich hinzufügen?',
    answer:
      'Ja, wenn der Wechselrichter speicherfähig ist oder ein separater Speicher-Wechselrichter vorgesehen wird. Wir schauen uns das an und sagen Ihnen, ob und wie das technisch umsetzbar ist.',
  },
]

export default function PhotovoltaikPage() {
  return (
    <>
      <Hero
        headline="Photovoltaik – Ihren Strom selbst produzieren."
        subheadline="Elektrische Installation von PV-Anlagen in Witten und Umgebung. Von der Montage bis zur Netzanmeldung – alles aus einer Hand."
        imageUrl="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80"
        imageAlt="Photovoltaik-Anlage auf Hausdach – Wunderlich Elektrotechnik"
        badge="PV-Anlagen · Batteriespeicher · Netzanmeldung inklusive"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-content">
          <h2>Was wir übernehmen – und was nicht</h2>
          <p>
            Wir installieren PV-Anlagen auf der <strong>elektrischen Seite</strong>: Modulanschluss,
            Wechselrichter, DC- und AC-Leitungen, Speicheranbindung, Zählerkonzept und Netzanmeldung.
            Was wir nicht anbieten: statische Dachbewertung, Gerüstbau oder ausführliche
            Wirtschaftlichkeitsberechnungen.
          </p>
          <p>
            Wir schauen uns Ihre Dachfläche an und schätzen ab, welche Anlagenleistung (kWp)
            realistisch umsetzbar ist – auf Basis von Ausrichtung, Neigung und verfügbarer Fläche.
            Diese Einschätzung erfolgt unverbindlich.
          </p>

          <h2>Mit oder ohne Speicher</h2>
          <p>
            Ein <strong>Batteriespeicher</strong> macht tagsüber produzierten Strom für die
            Abendstunden nutzbar und erhöht den Eigenverbrauch deutlich. Ob er sich rechnet,
            hängt von Ihrem Verbrauchsprofil und Strompreis ab – wir beraten Sie dazu ehrlich.
          </p>

          <h2>Kombination mit Wallbox</h2>
          <p>
            Eine PV-Anlage lässt sich gut mit einer Wallbox kombinieren – dann laden Sie Ihr
            E-Auto tagsüber mit Sonnenstrom. Wir planen beides aufeinander abgestimmt.
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

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">So läuft es ab</h2>
          <div className="space-y-8">
            {steps.map((s) => (
              <div key={s.step} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">{s.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqs} title="Fragen zur Photovoltaik" />

      <CTA
        headline="PV-Anlage anfragen"
        subtext="Vor-Ort-Einschätzung – wir sagen Ihnen ehrlich, was wir umsetzen können."
      />
    </>
  )
}
