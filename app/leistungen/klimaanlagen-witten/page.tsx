import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'
import FAQ from '@/components/FAQ'
import { CheckCircle, MapPin } from 'lucide-react'

// HINWEIS FÜR ENTWICKLER:
// Diese Seite dient als Template für alle Stadt-Leistungs-Kombinationen.
// Weitere Seiten anlegen nach dem Muster: /leistungen/[leistung]-[stadt]
// Beispiele:
//   /leistungen/klimaanlagen-hattingen
//   /leistungen/klimaanlagen-gevelsberg
//   /leistungen/waermepumpen-witten
//   /leistungen/elektroinstallation-hagen
// Einfach diesen Ordner kopieren und Metadaten, Inhalte sowie den Ort anpassen.

export const metadata: Metadata = {
  title: 'Klimaanlage installieren in Witten – Wunderlich Elektrotechnik',
  description:
    'Klimaanlagen Installation in Witten und Umgebung. Daikin, Mitsubishi, Toshiba – fachgerecht montiert vom zertifizierten Meisterbetrieb. Vor-Ort-Besichtigung nach Vereinbarung.',
  openGraph: {
    title: 'Klimaanlage in Witten installieren – Wunderlich Elektrotechnik',
    description: 'Ihr lokaler Klimatechnik-Meister in Witten: Split- und Multisplitanlagen, schnelle Montage, faire Preise.',
  },
}

const faqs = [
  {
    question: 'Wie lange dauert die Klimaanlagen-Installation in Witten?',
    answer:
      'Eine Standard-Splitanlage ist in Witten in der Regel an einem Tag installiert. Wir sind im gesamten Stadtgebiet Witten tätig.',
  },
  {
    question: 'Installieren Sie auch in Witten-Annen, Herbede oder Heven?',
    answer:
      'Ja, wir sind in allen Witten-Stadtteilen tätig: Witten-Mitte, Annen, Herbede, Heven, Bommern, Durchholz und weiteren Ortsteilen – alles ohne zusätzliche Anfahrtkosten.',
  },
  {
    question: 'Gibt es in Witten Einschränkungen für Klimaanlagen-Außengeräte?',
    answer:
      'Im historischen Bereich der Wittener Innenstadt und in denkmalgeschützten Gebäuden kann die Aufstellung von Außengeräten eingeschränkt sein. Wir klären das im Rahmen der Vor-Ort-Besichtigung mit Ihnen ab.',
  },
]

export default function KlimaanlagenWittenPage() {
  return (
    <>
      <Hero
        headline="Klimaanlage in Witten – Ihr lokaler Spezialist."
        subheadline="Split- und Multisplitanlagen von Daikin, Mitsubishi und Toshiba. Fachgerecht installiert in Witten und dem gesamten Stadtgebiet – ohne Anfahrtzuschlag."
        imageUrl="https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1920&q=80"
        imageAlt="Klimaanlage Witten – Wunderlich Elektrotechnik"
        badge="Witten · Kein Anfahrtzuschlag · Vor-Ort-Termin in 24h"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-accent mb-6">
            <MapPin className="w-5 h-5" />
            <span className="font-semibold">Lokaler Anbieter in Witten – Casinostraße 2, 58452 Witten</span>
          </div>

          <div className="prose-content">
            <h2>Klimatechnik für Witten und Umgebung</h2>
            <p>
              Als Elektro- und Kältetechnikbetrieb mit Sitz in Witten sind wir Ihr direkter Ansprechpartner für
              Klimaanlagen im gesamten Stadtgebiet. Ob Wohnung in der Innenstadt, Einfamilienhaus in Herbede
              oder Gewerbeobjekt in Annen – wir sind schnell vor Ort und kennen die örtlichen Gegebenheiten.
            </p>
            <p>
              Als Wittener Betrieb sind wir nicht nur preisgünstig in der Anfahrt – wir sind auch persönlich
              erreichbar und stehen nach der Installation für Service und Wartung zur Verfügung. Kein Hotline-
              Chaos, kein Warten auf Rückrufe.
            </p>

            <h2>Was wir in Witten installieren</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {[
              'Splitklima für Einzelzimmer (Schlafzimmer, Wohnzimmer)',
              'Multisplit für mehrere Räume mit einem Außengerät',
              'Klimaanlagen für Büros und Praxen',
              'Gewerbekühlung für kleine Läden und Restaurants',
              'Jahreswartung bestehender Klimaanlagen',
              'Reparatur und Kältemittel-Nachfüllung',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqs} title="Fragen für Kunden in Witten" />

      <CTA
        headline="Klimaanlage in Witten anfragen"
        subtext="Wir melden uns innerhalb von 24 Stunden und kommen zur Vor-Ort-Besichtigung – ohne Verpflichtung."
      />
    </>
  )
}
