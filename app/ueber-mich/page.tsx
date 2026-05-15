import type { Metadata } from 'next'
import { Award, Clock, ShieldCheck, Users, CheckCircle } from 'lucide-react'
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

const werte = [
  {
    icon: Award,
    title: 'Qualität ohne Kompromisse',
    description:
      'Wir installieren nur das, wovon wir überzeugt sind – und übernehmen nur Aufträge, die wir wirklich sauber ausführen können.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparenz',
    description:
      'Sie bekommen ein schriftliches Angebot, bevor wir anfangen. Was drinsteht, gilt. Wir erklären Ihnen, was wir tun und warum.',
  },
  {
    icon: Users,
    title: 'Verlässliches Team',
    description:
      'Wir sind persönlich erreichbar und haben ein eingespieltes Team an unserer Seite. So können wir auch mehrere Aufträge parallel zuverlässig abwickeln.',
  },
  {
    icon: Clock,
    title: 'Termintreue',
    description:
      'Wir erscheinen zum vereinbarten Termin. Wenn etwas dazwischenkommt, sagen wir rechtzeitig Bescheid.',
  },
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
              <h2>Unser Team</h2>
              <p>
                Wir sind Sebastian Wunderlich – Industriemeister Elektrotechnik und Inhaber von
                Wunderlich Elektrotechnik in Witten. Unsere Wurzeln liegen in der Industrie:
                Von 2008 bis 2012 habe ich meine Ausbildung zum{' '}
                <strong>Elektroniker für Betriebstechnik</strong> bei der{' '}
                <strong>Deutschen Edelstahlwerke GmbH</strong> in Witten absolviert –
                einem der modernsten Elektrostahlwerke Deutschlands. Anschließend habe ich
                dort über viele Jahre in der Elektro- und Kältetechnik gearbeitet.
              </p>
              <p>
                Das Elektrostahlwerk ist eine anspruchsvolle Umgebung: Hochspannung,
                komplexe Schaltanlagen, industrielle Kältemaschinen, ständiger
                Betriebsdruck. Wer dort jahrelang Elektro- und Kältetechnik macht,
                weiß, wie Anlagen wirklich funktionieren – nicht nur auf dem Papier.
              </p>
              <p>
                Seit 2026 führen wir unseren eigenen Betrieb. Mit einem starken Team an
                unserer Seite sind wir für Privat- und Gewerbekunden in Witten und Umgebung
                der verlässliche Ansprechpartner für Elektro- und Kältetechnik.
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

      {/* Werte */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Unsere Arbeitsweise
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {werte.map((w) => {
              const Icon = w.icon
              return (
                <div key={w.title} className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">{w.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{w.description}</p>
                  </div>
                </div>
              )
            })}
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
