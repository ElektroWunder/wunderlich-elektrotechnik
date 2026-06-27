import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'

export const metadata: Metadata = {
  title: 'Über uns – Sebastian Wunderlich, Industriemeister Elektrotechnik',
  description:
    'Lernen Sie Sebastian Wunderlich kennen: Industriemeister Elektrotechnik, Kältemittelschein Kategorie I, seit 2008 in der Elektro- und Kältetechnik. Meisterbetrieb in Witten.',
}

const qualifikationen = [
  'Ausbildung: Elektroniker für Betriebstechnik (IHK, 2008–2012)',
  'Industriemeister Elektrotechnik (IHK)',
  'Kältemittelschein Kategorie I (EU 517/2014)',
  'Eingetragener Meisterbetrieb, Handwerksrolle HWK Dortmund',
  'Sachkundiger für elektrische Betriebsmittel (DGUV V3)',
  'Seit 2008 in der Elektro- und Kältetechnik – davon über 12 Jahre im Industrieumfeld',
]


export default function UeberMichPage() {
  return (
    <>
      <Hero
        headline="Qualität entsteht durch Erfahrung."
        subheadline="Seit 2008 in der Elektro- und Kältetechnik – als selbstständiger Meisterbetrieb für Privat- und Gewerbekunden in Witten und Umgebung."
        imageUrl="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80"
        imageAlt="Sebastian Wunderlich – Meisterbetrieb Wunderlich Elektrotechnik"
        badge="Industriemeister Elektrotechnik · Kältemittelschein Kat. I"
      />

      {/* Steckbrief */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Foto-Platzhalter */}
            <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl aspect-[4/5] flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">👷</span>
              </div>
              <p className="text-white font-bold text-xl mb-1">Sebastian Wunderlich</p>
              <p className="text-gray-300 text-sm">Industriemeister Elektrotechnik</p>
              <p className="text-accent-light text-xs mt-2">[ Foto wird ergänzt ]</p>
            </div>

            {/* Text */}
            <div className="prose-content">
              <h2>Sebastian Wunderlich</h2>
              <p>
                Inhaber und Gründer von Wunderlich Elektrotechnik. Die Ausbildung zum{' '}
                <strong>Elektroniker für Betriebstechnik</strong> absolvierte Sebastian
                Wunderlich von 2008 bis 2012 bei der{' '}
                <strong>Deutschen Edelstahlwerke GmbH</strong> in Witten – einem der
                modernsten Elektrostahlwerke Deutschlands. In den Jahren danach war er
                dort in der Elektro- und Kältetechnik tätig.
              </p>
              <p>
                Ein Stahlwerk ist kein einfaches Umfeld: Hochspannung, komplexe
                Schaltanlagen, industrielle Kältemaschinen, hoher Betriebsdruck. Wer
                dort über ein Jahrzehnt lang arbeitet, kennt den Unterschied zwischen
                Theorie und Praxis – und weiß, worauf es bei sauber ausgeführter
                Handwerksarbeit wirklich ankommt.
              </p>
              <p>
                Seit 2026 ist Wunderlich Elektrotechnik als eigenständiger Meisterbetrieb
                für Privat- und Gewerbekunden in Witten und Umgebung tätig.
              </p>

              <h2>Servicegebiet</h2>
              <p>
                Unser Schwerpunkt liegt in <strong>Witten und dem näheren Umkreis</strong>.
                Bei Fragen zur Anfahrt sprechen Sie uns einfach kurz an.
              </p>

              <h2>Direktkontakt</h2>
              <p>
                <a href="mailto:sebastian.wunderlich@wunderlich-elektrotechnik.de" className="text-accent hover:underline">
                  sebastian.wunderlich@wunderlich-elektrotechnik.de
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Qualifikationen */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-10 text-center">
            Qualifikationen & Zertifizierungen
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {qualifikationen.map((q) => (
              <div key={q} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm font-medium">{q}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA
        headline="Sprechen wir über Ihr Projekt"
        subtext="Kein anonymes Anfrageformular – wir sind direkt erreichbar und melden uns persönlich."
        primaryLabel="Kontakt aufnehmen"
      />
    </>
  )
}
