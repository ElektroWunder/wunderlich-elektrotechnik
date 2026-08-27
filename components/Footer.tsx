import Link from 'next/link'

const leistungen = [
  { href: '/leistungen/klimaanlagen', label: 'Klimaanlagen' },
  { href: '/leistungen/waermepumpen', label: 'Wärmepumpen' },
  { href: '/leistungen/elektroinstallation', label: 'Elektroinstallation' },
  { href: '/leistungen/photovoltaik', label: 'Photovoltaik' },
  { href: '/leistungen/wallbox', label: 'Wallbox & E-Laden' },
  { href: '/leistungen/wartung', label: 'Wartung & E-Check' },
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
            <p className="text-gray-400 text-sm leading-relaxed">
              Klima, Kälte, Strom – aus einer Hand.
              Meisterbetrieb für Elektro- und Kältetechnik aus Witten.
            </p>
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

          {/* Einsatzgebiet */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Einsatzgebiet
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Schwerpunkt Witten – der genaue Einsatzbereich richtet sich nach Auftrag. Sprechen Sie uns einfach an.
            </p>
          </div>

          {/* Erreichbarkeit & Rechtliches */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Erreichbarkeit
            </h3>
            <div className="text-sm text-gray-400 space-y-1 mb-6">
              <div className="flex justify-between gap-4">
                <Link href="/anfrage" className="hover:text-white transition-colors">Termine</Link>
                <span>nach Vereinbarung</span>
              </div>
              <div className="flex justify-between gap-4">
                <span>Rückruf</span>
                <Link href="/kontakt" className="hover:text-white transition-colors">innerhalb 24 h</Link>
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
              <li>
                <Link href="/admin/login" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                  Mitarbeiter-Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
