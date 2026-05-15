import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'
import FAQ from '@/components/FAQ'

export const metadata: Metadata = {
  title: 'Wartung & E-Check – Klimawartung & DGUV V3 | EN-Kreis',
  description:
    'Wartungsverträge für Klimaanlagen und DGUV-V3-Prüfungen (E-Check) im Ennepe-Ruhr-Kreis. Prüfprotokoll, Betriebssicherheit, Herstellergarantie erhalten.',
}

const klimaWartung = [
  'Sichtprüfung Innen- und Außengerät',
  'Reinigung der Wärmetauscher und Filter',
  'Prüfung des Kältemittelkreislaufs (Druck, Feuchtigkeit)',
  'Dichtheitsprüfung nach EU 517/2014',
  'Überprüfung aller Sicherheits- und Schutzfunktionen',
  'Messung von Betriebsparametern (Temperaturen, Stromaufnahme)',
  'Reinigung des Kondensatwannen und Ablaufsystems',
  'Prüfprotokoll und Wartungsaufkleber',
]

const eCheck = [
  'Sichtprüfung aller elektrischen Betriebsmittel',
  'Messung von Isolationswiderstand und Schutzleiterwiderstand',
  'Prüfung von FI-Schutzschaltern und LS-Automaten',
  'Messung der Berührungsspannung',
  'Prüfung ortsveränderlicher Geräte (Verlängerungskabel, Werkzeuge etc.)',
  'Vollständiges Prüfprotokoll (DGUV V3)',
  'Prüfplaketten auf allen geprüften Betriebsmitteln',
  'Mängelprotokoll mit Empfehlungen',
]

const faqs = [
  {
    question: 'Wie oft muss eine Klimaanlage gewartet werden?',
    answer:
      'Nach EU 517/2014 sind Anlagen mit mehr als 3 kg Kältemittel mindestens jährlich auf Dichtheit zu prüfen. Unabhängig von der Norm empfehlen wir eine Jahreswartung, um die Energieeffizienz zu erhalten, die Herstellergarantie nicht zu gefährden und teure Folgeschäden zu vermeiden. Wir bieten Wartungsverträge an, bei denen wir den Termin selbst im Blick behalten.',
  },
  {
    question: 'Was ist die DGUV V3 / der E-Check?',
    answer:
      'Die DGUV Vorschrift 3 (früher: BGV A3) verpflichtet Arbeitgeber, elektrische Anlagen und Betriebsmittel regelmäßig durch eine Elektrofachkraft prüfen zu lassen. Der Prüfzyklus hängt vom Betrieb und den eingesetzten Geräten ab (typisch: 1–4 Jahre für stationäre Anlagen, 6 Monate bis 1 Jahr für ortsveränderliche Geräte). Das vollständige Prüfprotokoll ist gegenüber Berufsgenossenschaft und Versicherung nachweispflichtig.',
  },
  {
    question: 'Was passiert, wenn bei der DGUV-Prüfung Mängel festgestellt werden?',
    answer:
      'Wir dokumentieren alle Mängel im Prüfprotokoll mit Handlungsempfehlung. Kleinere Mängel können wir häufig direkt vor Ort beheben. Bei sicherheitsrelevanten Mängeln wird das betroffene Betriebsmittel sofort außer Betrieb genommen, bis es repariert oder ersetzt wurde. Sie erhalten eine klare Übersicht mit Prioritäten.',
  },
  {
    question: 'Bieten Sie Wartungsverträge an?',
    answer:
      'Ja – wir schließen Wartungsverträge für Klimaanlagen ab. Das hat Vorteile: fester Jahrespreis, fester Termin, keine Überraschungen. Im Vertrag ist die vollständige Wartung inkl. Kältemittelkontrolle und Prüfprotokoll enthalten. Sprechen Sie uns an, wir erstellen Ihnen ein individuelles Angebot abhängig von Anlagentyp und Anzahl.',
  },
]

export default function WartungPage() {
  return (
    <>
      <Hero
        headline="Wartung & E-Check – Sicherheit, die bleibt."
        subheadline="Klimaanlagen-Wartung und DGUV-V3-Prüfungen (E-Check) für Gewerbe und Privatnutzer im Ennepe-Ruhr-Kreis. Vollständige Dokumentation, Prüfprotokoll inklusive."
        imageUrl="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80"
        imageAlt="Techniker bei der Wartung – Wunderlich Elektrotechnik"
        badge="Klimawartung · DGUV V3 · EU 517/2014 Dichtheitsprüfung"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-content">
          <h2>Vorbeugen ist günstiger als Reparieren</h2>
          <p>
            Eine nicht gewartete Klimaanlage verliert jährlich bis zu 10 % ihrer Effizienz – verschmutzte
            Wärmetauscher, verstopfte Filter, sinkender Kältemitteldruck. Nach 5 Jahren ohne Wartung kann
            eine Anlage doppelt so viel Strom verbrauchen wie bei Auslieferung. Eine jährliche Wartung
            amortisiert sich allein durch eingesparte Energiekosten.
          </p>
          <p>
            Dazu kommt die Pflicht nach <strong>EU 517/2014</strong>: Anlagen mit mehr als 3 kg Kältemittel
            müssen jährlich auf Dichtheit geprüft werden – mit dokumentiertem Ergebnis. Wir führen diese
            Prüfungen durch und stellen das erforderliche Prüfprotokoll aus.
          </p>

          <h2>E-Check für Gewerbebetriebe</h2>
          <p>
            Der E-Check (DGUV Vorschrift 3) ist für Unternehmen keine freiwillige Leistung, sondern
            gesetzliche Pflicht. Arbeitgeber haften bei Elektrounfällen, wenn keine regelmäßige Prüfung
            nachgewiesen werden kann. Versicherungen können im Schadensfall die Leistung kürzen.
            Wir führen DGUV-V3-Prüfungen durch und erstellen lückenlose Prüfprotokolle.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Klimaanlage Wartung</h2>
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
              <h2 className="text-2xl font-bold text-primary mb-6">E-Check / DGUV V3</h2>
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

      <FAQ items={faqs} title="Fragen zu Wartung & E-Check" />

      <CTA
        headline="Wartung oder E-Check anfragen"
        subtext="Wir erstellen Ihnen ein Angebot für einen Wartungsvertrag oder eine einmalige DGUV-V3-Prüfung. Vollständige Dokumentation selbstverständlich inklusive."
      />
    </>
  )
}
