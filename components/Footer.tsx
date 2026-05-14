import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

const leistungen = [
  { href: '/leistungen/klimaanlagen', label: 'Klimaanlagen' },
  { href: '/leistungen/waermepumpen', label: 'Wärmepumpen' },
  { href: '/leistungen/elektroinstallation', label: 'Elektroinstallation' },
  { href: '/leistungen/photovoltaik', label: 'Photovoltaik' },
  { href: '/leistungen/wallbox', label: 'Wallbox & E-Laden' },
  { href: '/leistungen/wartung', label: 'Wartung & E-Check' },
]

const servicegebiet = [
  'Witten', 'Wetter', 'Sprockhövel', 'Hattingen',
  'Gevelsberg', 'Ennepetal', 'Schwelm', 'Herdecke', 'Hagen',
  'Dortmund', 'Bochum',
]

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Firmeninfo */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-9 h-9 bg-white/10 rounded-lg shrink-0">
                <span className="text-white font-black text-base leading-none">
                  W<span className="text-accent-light">E</span>
                </span>
              </div>
              <div className="leading-tight">
                <span className="block text-sm font-black tracking-tight uppercase">Wunderlich</span>
                <span className="block text-[10px] text-accent-light font-semibold tracking-widest uppercase">Elektrotechnik</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Klima, Kälte, Strom – aus einer Hand.
              Meisterbetrieb für Elektro- und Kältetechnik
              im Ennepe-Ruhr-Kreis.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <span>Casinostraße 2<br />58452 Witten</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-accent" />
                <a href="tel:+49XXXXXXXXXX" className="hover:text-white transition-colors">
                  +49 XXX XXXXXXXX
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-accent" />
                <span className="text-gray-500 italic">E-Mail folgt in Kürze</span>
              </div>
            </div>
          </div>

          {/* Leistungen */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Leistungen
            </h3>
            <ul className="space-y-2">
              {leistungen.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Servicegebiet */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Servicegebiet
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Witten und Umgebung:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {servicegebiet.map((ort) => (
                <span
                  key={ort}
                  className="text-xs bg-primary-light px-2 py-1 rounded text-gray-300"
                >
                  {ort}
                </span>
              ))}
            </div>
          </div>

          {/* Links & Öffnungszeiten */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Erreichbarkeit
            </h3>
            <div className="text-sm text-gray-400 space-y-1 mb-6">
              <div className="flex justify-between gap-4">
                <span>Termine</span>
                <span>nach Vereinbarung</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Rückruf</span>
                <span>innerhalb 24 h</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Notfall</span>
                <span className="text-accent-light font-medium">Anruf genügt</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-3">
              Rechtliches
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="/impressum" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="text-sm text-gray-400 hover:text-white transition-colors">
                  AGB
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-light flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Wunderlich Elektrotechnik · Meisterbetrieb · HWK Dortmund
          </p>
          <p className="text-xs text-gray-600">
            Industriemeister Elektrotechnik · Kältemittelschein Kategorie I · EU 517/2014
          </p>
        </div>
      </div>
    </footer>
  )
}
