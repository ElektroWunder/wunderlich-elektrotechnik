import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: 'Elektroinstallation – Neuinstallation & Sanierung | Witten',
  description:
    'Professionelle Elektroinstallation in Witten: Neuinstallation im Rohbau, Sanierung älterer Anlagen, Schaltschrankbau. Nach VDE 0100. Meisterbetrieb.',
}

const included = [
  'Installation von Leitungen, Steckdosen und Schaltern',
  'Schaltschrankbau und Unterverteilungen',
  'FI-Schutzschalter und Überspannungsschutz',
  'Netzanschluss und Zähleranmeldung',
  'Prüfung nach DIN VDE 0100-600 mit Messprotokoll',
  'Vollständige Dokumentation und Schaltplan',
]

export default function ElektroinstallationPage() {
  return (
    <>
      <Hero
        headline="Elektroinstallation – sicher, normgerecht, dauerhaft."
        subheadline="Neuinstallation, Sanierung älterer Anlagen und Schaltschrankbau nach VDE 0100. In Witten und Umgebung – vom Meisterbetrieb."
        imageUrl="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
        imageAlt="Schaltschrank – Wunderlich Elektrotechnik Elektroinstallation"
        badge="VDE 0100 · Schaltschrankbau · Neuinstallation & Sanierung"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose-content mb-12">
            <p>
              Wir installieren normgerecht nach <strong>DIN VDE 0100</strong> – vom Rohbau bis
              zur Sanierung veralteter Anlagen. Jede Anlage wird vor der Übergabe gemessen und
              mit vollständigem Schaltplan und Messprotokoll dokumentiert.
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
        headline="Elektroinstallation anfragen"
        subtext="Wir besichtigen vor Ort und erstellen ein schriftliches Angebot."
      />
    </>
  )
}
