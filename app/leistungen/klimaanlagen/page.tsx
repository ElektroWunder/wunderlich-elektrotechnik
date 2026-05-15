import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'
import FAQ from '@/components/FAQ'

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
  'Fachgerechte Installation von Innen- und Außengerät',
  'Verlegung der Kältemittelleitungen und des Kondensatschlauchs',
  'Elektroanschluss nach VDE 0100',
  'Befüllung mit zertifiziertem Kältemittel (EU 517/2014)',
  'Inbetriebnahme und Funktionsprüfung',
  'Einweisung in Bedienung und Filterpflege',
  'Vollständige Dokumentation und Übergabeprotokoll',
  'Wartung und Reparatur bestehender Anlagen',
]

const steps = [
  {
    step: '01',
    title: 'Vor-Ort-Besichtigung',
    description:
      'Wir schauen uns Ihren Raum und die Außenwand an, prüfen wo das Außengerät montiert werden kann und wie die Leitungsführung verlaufen soll. Erst dann können wir Ihnen einen verlässlichen Preis nennen.',
  },
  {
    step: '02',
    title: 'Angebot',
    description:
      'Sie erhalten ein schriftliches Angebot – aufgeschlüsselt nach Material und Arbeitszeit. Was drinsteht, gilt.',
  },
  {
    step: '03',
    title: 'Installation',
    description:
      'Wir montieren Innen- und Außengerät, verlegen die Kältemittelleitungen, stellen die elektrische Verbindung her und befüllen die Anlage. Eine Standard-Splitanlage ist in der Regel an einem Tag fertig.',
  },
  {
    step: '04',
    title: 'Inbetriebnahme & Einweisung',
    description:
      'Wir nehmen die Anlage in Betrieb, prüfen alle Funktionen und zeigen Ihnen, wie Sie die Bedienung und Filterpflege selbst durchführen können.',
  },
]

const faqs = [
  {
    question: 'Welche Anlagen installieren Sie?',
    answer:
      'Wir installieren Splitklimaanlagen – das heißt: ein Innengerät (Wandgerät), ein Außengerät. Wir arbeiten bevorzugt mit Daikin, Mitsubishi Electric und Toshiba, da diese Marken zuverlässig und langlebig sind. Multisplit-Anlagen (ein Außengerät, mehrere Innengeräte) sind ebenfalls möglich.',
  },
  {
    question: 'Kann ich auch eine bestehende Anlage warten oder reparieren lassen?',
    answer:
      'Ja. Wir warten und reparieren Splitklimaanlagen – unabhängig davon, wo sie installiert wurden. Bei der Wartung reinigen wir Filter und Wärmetauscher, prüfen den Kältemittelkreislauf und dokumentieren den Zustand der Anlage.',
  },
  {
    question: 'Kann man mit der Klimaanlage auch heizen?',
    answer:
      'Ja – moderne Inverterklimaanlagen arbeiten in beide Richtungen und heizen sehr effizient, auch bei Minustemperaturen. Das ist kein Ersatz für eine Heizungsanlage, aber eine sinnvolle Ergänzung – zum Beispiel für ein Büro oder ein Schlafzimmer.',
  },
  {
    question: 'Brauche ich eine Baugenehmigung für das Außengerät?',
    answer:
      'In NRW ist das Außengerät einer Splitanlage in den meisten Fällen genehmigungsfrei. In denkmalgeschützten Gebäuden oder bei bestimmten Aufstellsituationen kann das anders sein. Wir klären das mit Ihnen vor Ort.',
  },
  {
    question: 'Was kostet eine Splitklimaanlage inklusive Montage?',
    answer:
      'Das hängt vom Gerät, der Leitungslänge und dem Montageaufwand ab. Als Orientierung: eine einfache Splitanlage (Wohnzimmer, 20–35 m²) liegt inklusive Montage typischerweise zwischen 1.500 € und 2.800 €. Nach der Besichtigung nennen wir Ihnen einen genauen Preis.',
  },
]

export default function KlimaanlagenPage() {
  return (
    <>
      <Hero
        headline="Klimaanlagen – sauber installiert, zuverlässig gewartet."
        subheadline="Splitklimaanlagen von Daikin, Mitsubishi und Toshiba. Installation, Wartung und Reparatur in Witten und Umgebung. Kältemittelzertifiziert nach EU 517/2014, Kategorie I."
        imageUrl="https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1920&q=80"
        imageAlt="Klimaanlage Innengerät – Wunderlich Elektrotechnik Witten"
        badge="Daikin · Mitsubishi · Toshiba · EU 517/2014 zertifiziert"
        overlay="dark"
      />

      {/* Beschreibung */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-content">
          <h2>Was wir tun – und was nicht</h2>
          <p>
            Wir installieren, warten und reparieren <strong>Split- und Multisplitanlagen</strong>. Das ist unser Metier,
            das machen wir sauber und zuverlässig. Was wir nicht anbieten: komplexe Auslegungsberechnungen
            für Großobjekte mit vielen Zonen. Wenn Sie eine Klimaanlage für ein Zimmer, mehrere Räume,
            ein Büro oder eine kleine Gewerbeeinheit brauchen – dann sind wir die richtige Wahl.
          </p>
          <p>
            Als Kältetechnikbetrieb mit <strong>Kältemittelschein Kategorie I</strong> nach EU 517/2014
            dürfen wir alle Kältemittel fachgerecht handhaben. Die Arbeiten werden vollständig
            dokumentiert und protokolliert.
          </p>

          <h2>Split- und Multisplit-Systeme</h2>
          <p>
            Das klassische <strong>Splitsystem</strong> besteht aus einem Innengerät (z. B. Wandgerät)
            und einem Außengerät – ideal für einzelne Räume. Ein <strong>Multisplitsystem</strong>
            verbindet mehrere Innengeräte mit einem Außengerät, wenn mehrere Räume klimatisiert
            werden sollen. Beide Systeme nutzen moderne <strong>Inverter-Technik</strong>: Der
            Kompressor regelt seine Leistung stufenlos – das spart Energie und hält die
            Temperatur konstant.
          </p>

          <h2>Marken</h2>
          <p>
            Wir installieren bevorzugt <strong>Daikin</strong>, <strong>Mitsubishi Electric</strong> und
            <strong> Toshiba</strong> – Hersteller mit guter Ersatzteilversorgung und langen
            Garantiezeiten. Auf Wunsch installieren wir auch andere namhafte Marken.
          </p>
        </div>
      </section>

      {/* Was ist enthalten */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-10 text-center">
            Was der Auftrag umfasst
          </h2>
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

      {/* Ablauf */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">
            So läuft es ab
          </h2>
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

      <FAQ items={faqs} title="Fragen zur Klimaanlage" />

      <CTA
        headline="Klimaanlage anfragen"
        subtext="Angebot nach Vor-Ort-Besichtigung. Wir melden uns innerhalb von 24 Stunden."
        primaryLabel="Jetzt anfragen"
      />
    </>
  )
}
