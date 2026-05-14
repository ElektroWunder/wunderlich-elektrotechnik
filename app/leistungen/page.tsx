import type { Metadata } from 'next'
import { AirVent, Thermometer, Zap, Sun, Car, Wrench, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: 'Leistungen – Klima, Elektro & Photovoltaik',
  description:
    'Alle Leistungen von Wunderlich Elektrotechnik: Klimaanlagen, Wärmepumpen, Elektroinstallation, Photovoltaik, Wallbox und Wartung im Ennepe-Ruhr-Kreis.',
}

const services = [
  {
    icon: AirVent,
    title: 'Klimaanlagen',
    description:
      'Splitklimaanlagen von Daikin, Mitsubishi und Toshiba. Installation, Wartung und Reparatur. Kältemittelzertifiziert nach EU 517/2014.',
    href: '/leistungen/klimaanlagen',
    highlights: ['Splitklima & Multisplit', 'Inverter-Technik', 'Wartung & Reparatur', 'Kältemittelzertifiziert'],
  },
  {
    icon: Thermometer,
    title: 'Wärmepumpen',
    description:
      'Fachgerechter Elektroanschluss von Luft-Wasser-Wärmepumpen nach VDE 0100 und §14a EnWG. Dokumentiert und normgerecht.',
    href: '/leistungen/waermepumpen',
    highlights: ['Elektroanschluss', '§14a EnWG Lastabwurf', 'Netzbetreiber-Anmeldung', 'Dokumentation'],
  },
  {
    icon: Zap,
    title: 'Elektroinstallation',
    description:
      'Neuinstallation, Sanierung älterer Anlagen und Schaltschrankbau nach VDE 0100. Vom Rohbau bis zur Einzelreparatur.',
    href: '/leistungen/elektroinstallation',
    highlights: ['Neuinstallation & Sanierung', 'Schaltschrankbau', 'Zählerwechsel', 'VDE 0100'],
  },
  {
    icon: Sun,
    title: 'Photovoltaik',
    description:
      'Elektrische Installation von PV-Anlagen. Von der Einschätzung der Anlagengröße bis zur Netzanmeldung beim Netzbetreiber.',
    href: '/leistungen/photovoltaik',
    highlights: ['Elektrische Installation', 'Batteriespeicher', 'Netzanmeldung (MaStR)', 'Wechselrichter'],
  },
  {
    icon: Car,
    title: 'Wallbox & E-Laden',
    description:
      'AC-Ladelösungen mit 11 oder 22 kW für private und gewerbliche Nutzer. Eichrechtskonforme Abrechnung, KfW-förderfähig, inkl. Lastmanagement.',
    href: '/leistungen/wallbox',
    highlights: ['11 kW & 22 kW AC', 'Eichrechtskonforme Abrechnung', 'KfW-Förderung', 'Lastmanagement'],
  },
  {
    icon: Wrench,
    title: 'Wartung & E-Check',
    description:
      'Regelmäßige Wartung von Klimaanlagen erhält Effizienz und Garantie. DGUV-V3-Prüfungen (E-Check) für Gewerbebetriebe sichern Ihre Betriebssicherheit.',
    href: '/leistungen/wartung',
    highlights: ['Klima-Wartungsverträge', 'DGUV V3 / E-Check', 'Jahresprüfungen', 'Prüfprotokoll'],
  },
]

export default function LeistungenPage() {
  return (
    <>
      <Hero
        headline="Alles aus einer Hand"
        subheadline="Ich decke das komplette Spektrum aus Elektro- und Kältetechnik ab – so haben Sie einen einzigen Ansprechpartner für alle Gewerke."
        imageUrl="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1920&q=80"
        imageAlt="Elektrische Leitungen und Schaltschrank – Wunderlich Elektrotechnik"
        badge="6 Leistungsbereiche · Meisterbetrieb · EN-Kreis"
        overlay="medium"
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={service.href}
                  className={`flex flex-col md:flex-row gap-6 p-8 rounded-2xl border border-gray-100 hover:border-accent/20 hover:shadow-xl transition-all duration-300 ${
                    index % 2 === 1 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="shrink-0 w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-primary mb-3">{service.title}</h2>
                    <p className="text-gray-600 leading-relaxed mb-5">{service.description}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {service.highlights.map((h) => (
                        <span
                          key={h}
                          className="text-sm bg-primary/5 text-primary px-3 py-1 rounded-full font-medium"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={service.href}
                      className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent-dark transition-colors group"
                    >
                      Mehr zu {service.title} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <CTA
        headline="Nicht das Richtige dabei?"
        subtext="Beschreiben Sie mir einfach Ihr Vorhaben – ich sage Ihnen ehrlich, ob und wie ich helfen kann."
        primaryLabel="Anfrage stellen"
      />
    </>
  )
}
