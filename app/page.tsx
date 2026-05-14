import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AirVent,
  Thermometer,
  Zap,
  Sun,
  Car,
  Wrench,
  Award,
  Clock,
  ShieldCheck,
  User,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
} from 'lucide-react'
import Hero from '@/components/Hero'
import ServiceCard from '@/components/ServiceCard'
import CTA from '@/components/CTA'
import FAQ from '@/components/FAQ'

export const metadata: Metadata = {
  title: 'Wunderlich Elektrotechnik – Klima, Kälte, Strom aus einer Hand | Witten',
  description:
    'Ihr Meisterbetrieb für Klimaanlagen, Wärmepumpen, Elektroinstallation und Photovoltaik im Ennepe-Ruhr-Kreis. 13+ Jahre Erfahrung, kältemittelzertifiziert. Kostenlose Erstberatung.',
  openGraph: {
    title: 'Wunderlich Elektrotechnik – Klima, Kälte, Strom aus einer Hand',
    description:
      'Meisterbetrieb für Elektro- und Kältetechnik im Ennepe-Ruhr-Kreis. Klimaanlagen, Wärmepumpen, Photovoltaik, Wallbox.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Wunderlich Elektrotechnik – Handwerker bei der Arbeit',
      },
    ],
  },
}

const services = [
  {
    icon: AirVent,
    title: 'Klimaanlagen & Kältetechnik',
    description:
      'Split- und Multisplitanlagen führender Marken (Daikin, Mitsubishi, Toshiba), fachgerecht installiert und zertifiziert nach EU 517/2014.',
    href: '/leistungen/klimaanlagen',
  },
  {
    icon: Thermometer,
    title: 'Wärmepumpen',
    description:
      'Luft-Wasser-Wärmepumpen mit hydraulischem Abgleich und BAFA-Förderberatung. Effizienter heizen ab sofort.',
    href: '/leistungen/waermepumpen',
  },
  {
    icon: Zap,
    title: 'Elektroinstallation',
    description:
      'Neuinstallation, Sanierung, Schaltschrankbau und Smart-Home-Lösungen nach VDE 0100. Alles aus einer Hand.',
    href: '/leistungen/elektroinstallation',
  },
  {
    icon: Sun,
    title: 'Photovoltaik',
    description:
      'PV-Anlagen mit Speicher – von der Auslegung bis zur Netzanmeldung. Eigenstrom produzieren, Energiekosten senken.',
    href: '/leistungen/photovoltaik',
  },
  {
    icon: Car,
    title: 'Wallbox & E-Laden',
    description:
      'AC-Ladelösungen mit 11 oder 22 kW, eichrechtskonforme Abrechnung für Gewerbebetriebe, KfW-förderfähig.',
    href: '/leistungen/wallbox',
  },
  {
    icon: Wrench,
    title: 'Wartung & E-Check',
    description:
      'Wartungsverträge für Klimaanlagen und DGUV-V3-Prüfungen (E-Check) für Gewerbebetriebe. Sicherheit schriftlich bestätigt.',
    href: '/leistungen/wartung',
  },
]

const usps = [
  {
    icon: Award,
    title: 'Eingetragener Meisterbetrieb',
    description: 'HWK Dortmund, Handwerksrolle. Qualität und Gewährleistung, wie sie das Handwerk vorschreibt.',
  },
  {
    icon: Clock,
    title: '13+ Jahre Berufserfahrung',
    description: 'Seit über 13 Jahren in Kältetechnik und Industrietechnik. Ich kenne die Herausforderungen in der Praxis.',
  },
  {
    icon: ShieldCheck,
    title: 'Kältemittel-zertifiziert',
    description: 'Zertifiziert nach EU 517/2014, Kategorie I. Sachkundige Handhabung aller Kältemittel, rechtssicher.',
  },
  {
    icon: User,
    title: 'Persönlicher Ansprechpartner',
    description: 'Ich komme persönlich zur Besichtigung – kein Callcenter, kein Subunternehmer. Sie wissen, mit wem Sie es zu tun haben.',
  },
]

const references = [
  {
    title: 'Split-Klimaanlage im Einfamilienhaus',
    location: 'Privatkunde in Witten',
    tech: 'Daikin Emura 5 kW, Wandgerät',
    description:
      'Installation einer Inverter-Splitanlage im Wohnzimmer mit verdeckter Leitungsführung. Inklusive Inbetriebnahme und Einweisung.',
  },
  {
    title: 'Luft-Wasser-Wärmepumpe',
    location: 'Privatkunde in Hattingen',
    tech: 'Mitsubishi Zubadan, 8 kW, hydraulischer Abgleich',
    description:
      'Kompletttausch von Gas auf Wärmepumpe. Planung, Rohrleitungsarbeiten, Elektroanbindung und BAFA-Dokumentation.',
  },
  {
    title: 'Elektro-Sanierung + Wallbox',
    location: 'Gewerbebetrieb in Gevelsberg',
    tech: 'Unterverteilung, FI/LS-Schutz, 22-kW-Ladestation',
    description:
      'Vollständige Sanierung der Elektroanlage mit neuer Unterverteilung und Installation einer gewerblichen Ladestation mit eichrechtskonformer Abrechnung.',
  },
]

const faqs = [
  {
    question: 'Wie lange dauert die Installation einer Klimaanlage?',
    answer:
      'Eine Standard-Splitanlage (ein Innengerät, ein Außengerät) ist in der Regel an einem Tag installiert und in Betrieb. Multisplit-Systeme mit mehreren Räumen oder komplexere Leitungsführungen können 1–2 Tage in Anspruch nehmen. Ich kalkuliere das nach der kostenlosen Vor-Ort-Besichtigung exakt.',
  },
  {
    question: 'Wie hoch ist die staatliche Förderung für Wärmepumpen?',
    answer:
      'Über das BAFA-Programm (Bundesförderung für effiziente Gebäude) sind derzeit bis zu 70 % der förderfähigen Kosten möglich – abhängig von Einkommenssituation, Gebäudezustand und ob Sie eine fossile Heizung ersetzen. Die Beantragung läuft digital, ich begleite Sie dabei und erstelle die notwendige Fachunternehmererklärung.',
  },
  {
    question: 'Fahren Sie auch nach Hagen oder Bochum?',
    answer:
      'Mein Schwerpunkt liegt in Witten und Umgebung. Ich bin aber auch in Hagen, Dortmund und Bochum tätig. Sprechen Sie mich einfach an – ich sage Ihnen direkt, ob und wann ich kommen kann.',
  },
  {
    question: 'Erledigen Sie auch kleinere Elektroarbeiten?',
    answer:
      'Ja, ich nehme auch Einzelaufträge an – zum Beispiel das Setzen zusätzlicher Steckdosen, den Austausch von Sicherungsautomaten oder die Montage von Leuchten. Sprechen Sie mich einfach an, ich sage Ihnen ehrlich, was machbar ist.',
  },
  {
    question: 'Was kostet eine Photovoltaik-Anlage für ein Einfamilienhaus?',
    answer:
      'Das hängt stark von der Dachfläche, Ausrichtung und dem gewünschten Speicher ab. Als Orientierung: Eine typische Anlage für ein Einfamilienhaus (6–10 kWp) liegt heute ohne Speicher bei ca. 8.000–14.000 €, mit Speicher (5–10 kWh) bei 14.000–22.000 €. Ich erstelle Ihnen nach einer kostenlosen Dachanalyse ein individuelles Angebot mit Wirtschaftlichkeitsberechnung.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Hero
        headline={
          'Klima, Kälte, Strom –\naus einer Hand.'
        }
        subheadline="Ihr Elektro- und Kältetechnikmeister für den Ennepe-Ruhr-Kreis und Hagen. 13+ Jahre Erfahrung, zertifiziert nach EU 517/2014."
        imageUrl="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1920&q=80"
        imageAlt="Elektriker bei der Arbeit – Wunderlich Elektrotechnik"
        badge="Meisterbetrieb · HWK Dortmund · Kältemittelzertifiziert"
      />

      {/* Leistungs-Highlights */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Meine Leistungen
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Von der Klimaanlage über die Wärmepumpe bis zur Wallbox – ich biete Ihnen das
              komplette Leistungsspektrum rund um Elektro- und Kältetechnik.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.href} {...service} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/leistungen"
              className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent-dark transition-colors"
            >
              Alle Leistungen im Überblick <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Warum Wunderlich Elektrotechnik?
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Ich bin kein Großbetrieb mit anonymen Strukturen. Ich bin der Fachmann, der
              persönlich bei Ihnen erscheint – und für seine Arbeit geradestehe.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {usps.map((usp) => {
              const Icon = usp.icon
              return (
                <div key={usp.title} className="text-center">
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-bold text-primary mb-2">{usp.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{usp.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Referenzen */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Ausgewählte Projekte
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Ein kleiner Einblick in abgeschlossene Projekte aus dem Ennepe-Ruhr-Kreis.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {references.map((ref) => (
              <div
                key={ref.title}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-accent/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-primary to-primary-light h-32 flex items-center justify-center">
                  <Zap className="w-12 h-12 text-accent opacity-60" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span>{ref.location}</span>
                  </div>
                  <h3 className="font-bold text-primary mb-2">{ref.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">{ref.description}</p>
                  <div className="text-xs font-medium text-accent bg-accent/5 px-3 py-1.5 rounded-full inline-block">
                    {ref.tech}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/referenzen"
              className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent-dark transition-colors"
            >
              Alle Referenzen ansehen <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bewertungs-Sektion */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2">Kundenstimmen</h2>
            <p className="text-gray-500">Was Kunden über meine Arbeit sagen.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Familie Becker, Witten',
                text: 'Die Klimaanlage wurde exakt wie besprochen installiert, sauber und ohne Überraschungen bei der Rechnung. Sehr empfehlenswert.',
                stars: 5,
              },
              {
                name: 'Thomas H., Hattingen',
                text: 'Tolle Beratung zur Wärmepumpe, alle Förderthemen wurden erklärt. Die Anlage läuft super und ich bin rundum zufrieden.',
                stars: 5,
              },
              {
                name: 'Autohaus Neumann, Gevelsberg',
                text: 'E-Check und Wallbox-Installation für unseren Betrieb – alles professionell abgewickelt, Dokumentation vollständig. Klare Weiterempfehlung.',
                stars: 5,
              },
            ].map((review) => (
              <div key={review.name} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="text-primary font-semibold text-sm">{review.name}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            Bewertungen werden nach Fertigstellung der Google-Business-Seite direkt eingebunden.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={faqs} title="Häufige Fragen" />

      {/* Finaler CTA */}
      <CTA
        headline="Bereit für Ihr nächstes Projekt?"
        subtext="Ich erstelle Ihnen nach einer kostenlosen Vor-Ort-Besichtigung ein transparentes Festpreisangebot – ohne versteckte Kosten, ohne Überraschungen."
        primaryLabel="Kostenloses Angebot anfordern"
      />

      {/* Mobile Direktanruf */}
      <div className="bg-white py-8 text-center md:hidden">
        <a
          href="tel:+4917684995287"
          className="inline-flex items-center gap-2 text-primary font-semibold"
        >
          <Phone className="w-4 h-4 text-accent" /> +49 176 84995287
        </a>
      </div>
    </>
  )
}
