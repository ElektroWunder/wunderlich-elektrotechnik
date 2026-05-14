import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'
import FAQ from '@/components/FAQ'

export const metadata: Metadata = {
  title: 'Elektroinstallation – Neuinstallation & Sanierung | Witten',
  description:
    'Professionelle Elektroinstallation in Witten: Neuinstallation im Rohbau, Sanierung älterer Anlagen, Schaltschrankbau. Nach VDE 0100. Meisterbetrieb.',
}

const included = [
  'Planung und Beratung nach Ihren Anforderungen',
  'Installation von Leitungen, Steckdosen, Schaltern, Leuchten',
  'Schaltschrankbau und -montage',
  'Unterverteilungen und Leitungsschutzschalter',
  'FI-Schutzschalter und Überspannungsschutz',
  'Netzanschluss und Zähleranmeldung beim Netzbetreiber',
  'Prüfung nach DIN VDE 0100-600 mit Messprotokoll',
  'Vollständige Dokumentation',
]

const steps = [
  {
    step: '01',
    title: 'Bedarfsanalyse',
    description:
      'Ich bespreche mit Ihnen, was Sie benötigen: Wo kommen Steckdosen hin? Welche Verbraucher brauchen eigene Stromkreise? Ich erstelle einen Plan, den wir gemeinsam abstimmen.',
  },
  {
    step: '02',
    title: 'Leitungsverlegung und Installation',
    description:
      'Alle Leitungen werden nach VDE 0100 verlegt – in Schlitzen (Putzinstallation) oder auf Putz (Kabelkanäle). Schalter, Steckdosen und Verteiler werden sauber montiert.',
  },
  {
    step: '03',
    title: 'Schaltschrank und Absicherung',
    description:
      'Ich baue den Schaltschrank strukturiert auf, beschrifte jeden Stromkreis klar und installiere alle notwendigen Schutzorgane – LS-Schalter, FI-Schutzschalter, Überspannungsschutz.',
  },
  {
    step: '04',
    title: 'Prüfung, Abnahme, Übergabe',
    description:
      'Vor der Übergabe messe ich die fertige Anlage nach DIN VDE 0100-600. Das Prüfprotokoll erhalten Sie als Dokument – wichtig für Versicherungen und Weiterverkauf.',
  },
]

const faqs = [
  {
    question: 'Wann muss ich die Elektroanlage sanieren?',
    answer:
      'Anlagen, die älter als 30–40 Jahre sind, entsprechen oft nicht mehr dem aktuellen Stand der Technik. Typische Anzeichen: Schmelzsicherungen statt Leitungsschutzschaltern, kein FI-Schutzschalter, Zwei-Draht-Leitungen ohne Schutzleiter. Ich bewerte Ihre Anlage kostenlos und sage Ihnen, was sinnvoll ist.',
  },
  {
    question: 'Installieren Sie auch Smart-Home-Systeme?',
    answer:
      'Einfache Funk-Lösungen (z. B. smarte Steckdosen, Funklichtschalter) kann ich bei Bedarf integrieren. Komplexe Bus-Systeme wie KNX sind nicht mein Schwerpunkt – dafür gibt es spezialisierte Betriebe.',
  },
  {
    question: 'Was kostet eine neue Elektroinstallation im Einfamilienhaus?',
    answer:
      'Die Kosten hängen von der Wohnfläche, der Anzahl der Stromkreise und dem gewünschten Ausbaustandard ab. Ich erstelle nach einer Besichtigung ein genaues Angebot.',
  },
  {
    question: 'Können Sie auch kleinere Elektroarbeiten übernehmen?',
    answer:
      'Ja – das Nachrüsten einer Steckdose, das Verlegen eines Stromkreises für eine Wallbox, das Installieren einer Außenleuchte. Beschreiben Sie kurz, was Sie brauchen – ich melde mich schnell.',
  },
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-content">
          <h2>Normgerechte Elektroinstallation vom Meisterbetrieb</h2>
          <p>
            Elektroinstallation ist kein Bereich, in dem man Abstriche machen sollte. Eine fehlerhafte
            Verdrahtung ist eine der häufigsten Ursachen für Wohnungsbrände. Ich installiere ausschließlich
            nach den gültigen Normen – insbesondere der <strong>DIN VDE 0100</strong> – und dokumentiere
            jede Anlage vollständig mit Schaltplänen und Messprotokoll.
          </p>
          <p>
            Mit Erfahrung aus 17 Jahren Industrieumfeld kenne ich die Anforderungen an zuverlässige
            Elektrotechnik. Ich plane und installiere mit dem nötigen Abstand zum Minimum –
            weil eine gut gemachte Elektroanlage Jahrzehnte halten soll.
          </p>

          <h2>Neuinstallation im Rohbau</h2>
          <p>
            Im Neubau planen wir gemeinsam, wie viele Stromkreise Sie wo benötigen, wo Steckdosen,
            Schalter und Anschlüsse sitzen sollen. Ich koordiniere die Elektroarbeiten mit den anderen
            Gewerken und übergebe eine vollständig geprüfte und dokumentierte Anlage.
          </p>

          <h2>Sanierung älterer Elektroleitungen</h2>
          <p>
            In Gebäuden aus den 1960er bis 1980er Jahren sind häufig noch überalterte
            Sicherungskästen, Zweileiter-Systeme ohne Schutzleiter oder überlastete
            Leitungsquerschnitte verbaut. Ich saniere behutsam – mit möglichst wenig Aufbruch
            und maximalem Ergebnis.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-10 text-center">Was der Auftrag umfasst</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {included.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-12 text-center">So läuft es ab</h2>
          <div className="space-y-8">
            {steps.map((s) => (
              <div key={s.step} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-1">{s.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={faqs} title="Fragen zur Elektroinstallation" />

      <CTA
        headline="Elektroinstallation anfragen"
        subtext="Ich besichtige kostenlos und erstelle ein schriftliches Festpreisangebot."
      />
    </>
  )
}
