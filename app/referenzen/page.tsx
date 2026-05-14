import type { Metadata } from 'next'
import { Clock, Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: 'Referenzen – Abgeschlossene Projekte',
  description:
    'Referenzprojekte von Wunderlich Elektrotechnik werden in Kürze hier ergänzt. Sprechen Sie uns gerne direkt an.',
}

export default function ReferenzenPage() {
  return (
    <>
      <Hero
        headline="Unsere Arbeit spricht für sich."
        subheadline="Referenzfotos und Projektbeschreibungen aus dem Ennepe-Ruhr-Kreis folgen in Kürze."
        imageUrl="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=80"
        imageAlt="Referenzprojekte Wunderlich Elektrotechnik"
        badge="Referenzen folgen in Kürze"
        overlay="medium"
      />

      <section className="py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Clock className="w-8 h-8 text-accent" />
          </div>

          <h2 className="text-3xl font-bold text-primary mb-4">
            Referenzen werden ergänzt
          </h2>

          <p className="text-gray-500 text-lg leading-relaxed mb-4">
            Der Betrieb ist frisch gestartet – die ersten abgeschlossenen Projekte werden hier
            mit Fotos und Kurzbeschreibungen dokumentiert, sobald die Kunden ihre Zustimmung
            gegeben haben.
          </p>

          <p className="text-gray-500 leading-relaxed mb-10">
            Wenn Sie Fragen zur Qualität meiner Arbeit haben: Ich stehe persönlich Rede und Antwort.
            Rufen Sie mich einfach an.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+4917684995287"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3.5 rounded-lg font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              +49 176 84995287
            </a>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 border border-primary/20 text-primary hover:bg-gray-50 px-6 py-3.5 rounded-lg font-semibold transition-colors"
            >
              Kontaktformular
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <CTA
        headline="Werden Sie mein erster Referenzkunde?"
        subtext="Kostenlose Vor-Ort-Besichtigung, transparentes Angebot – und anschließend ein sauber ausgeführter Auftrag."
        primaryLabel="Anfrage stellen"
      />
    </>
  )
}
