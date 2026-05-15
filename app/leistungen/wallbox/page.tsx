import type { Metadata } from 'next'
import { CheckCircle } from 'lucide-react'
import Hero from '@/components/Hero'
import CTA from '@/components/CTA'
import FAQ from '@/components/FAQ'

export const metadata: Metadata = {
  title: 'Wallbox – E-Auto laden mit 11 kW & 22 kW | EN-Kreis',
  description:
    'Wallbox Installation im Ennepe-Ruhr-Kreis: 11 kW und 22 kW AC-Ladelösungen, eichrechtskonforme Abrechnung, Lastmanagement. KfW-förderfähig. Meisterbetrieb.',
}

const included = [
  'Beratung zur passenden Wallbox-Leistung und Fabrikat',
  'Prüfung der vorhandenen Hausinstallation und Netzanschluss',
  'Verlegung der Zuleitung (NYM oder Erdkabel)',
  'Montage und Inbetriebnahme der Wallbox',
  'Absicherung und FI-Schutz nach VDE 0100-722',
  'Netzbetreiber-Anmeldung bei ≥ 11 kW (Pflicht)',
  'Eichrechtskonforme Abrechnung für Gewerbebetriebe (auf Anfrage)',
  'Dynamisches Lastmanagement für Mehrfachinstallationen',
  'KfW-Förderantrag-Unterstützung',
]

const faqs = [
  {
    question: '11 oder 22 kW – was brauche ich wirklich?',
    answer:
      'Die meisten Elektroautos laden mit maximal 11 kW AC. Eine 11-kW-Wallbox lädt ein leeres 60-kWh-Fahrzeug in ca. 6 Stunden voll – über Nacht kein Problem. 22 kW lohnen sich nur, wenn Ihr Fahrzeug 22 kW unterstützt (aktuell wenige Modelle: z. B. Renault Zoe ältere Jahrgänge) oder wenn Sie mehrere Fahrzeuge über Lastmanagement teilen wollen. Wir beraten Sie zur sinnvollen Lösung.',
  },
  {
    question: 'Muss ich die Wallbox beim Netzbetreiber anmelden?',
    answer:
      'Ladeeinrichtungen ab 11 kW müssen dem Netzbetreiber gemeldet werden (§ 14a EnWG). Der Netzbetreiber kann in diesem Fall ein steuerbares Gerät fordern (Smart Meter). Wir erledigen diese Anmeldung für Sie und installieren nur Geräte, die §-14a-kompatibel sind.',
  },
  {
    question: 'Welche Förderung gibt es für Wallboxen?',
    answer:
      'Der KfW-Zuschuss 442 für private Wallboxen läuft derzeit nicht mehr. Für gewerbliche Ladelösungen gibt es jedoch Programme auf Bundes- und Landesebene. Einige Arbeitgeber erstatten die Installationskosten steueroptimiert. Wir halten uns zu aktuellen Programmen auf dem Laufenden – sprechen Sie uns an.',
  },
  {
    question: 'Kann ich die Wallbox mit meiner PV-Anlage koppeln?',
    answer:
      'Ja – viele moderne Wallboxen (z. B. von go-e, Fronius Wattpilot, Keba) unterstützen PV-Überschussladen. Das bedeutet: Wenn die PV-Anlage mehr produziert als das Haus verbraucht, wird der Überschuss direkt ins Fahrzeug geladen statt eingespeist. Das maximiert den Eigenverbrauch. Wir planen Wallbox und PV-Anlage von Anfang an aufeinander abgestimmt.',
  },
  {
    question: 'Was kostet eine Wallbox-Installation?',
    answer:
      'Die Installationskosten hängen vom Verlegeweg (Wanddurchbruch, Kabelkanal, Erdkabel), der Leitungslänge und dem notwendigen Zuleitungsquerschnitt ab. Typisch für eine private Einzelwallbox mit kurzer Zuleitung: 600–1.200 € Installations- und Materialkosten, plus die Wallbox selbst (250–800 €). Wir erstellen Ihnen nach kurzer Abfrage ein konkretes Angebot.',
  },
]

export default function WallboxPage() {
  return (
    <>
      <Hero
        headline="Wallbox – Ihr E-Auto zuverlässig laden."
        subheadline="AC-Ladelösungen mit 11 und 22 kW für Eigenheimbesitzer und Gewerbebetriebe im Ennepe-Ruhr-Kreis. Netzbetreiber-Anmeldung und §-14a-Konformität inklusive."
        imageUrl="https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=1920&q=80"
        imageAlt="Wallbox E-Auto laden – Wunderlich Elektrotechnik"
        badge="11 kW & 22 kW · §14a EnWG · Eichrechtskonforme Abrechnung"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose-content">
          <h2>Professionelles Laden – kein Kompromiss</h2>
          <p>
            Eine Haushaltssteckdose als Ladepunkt für ein Elektroauto ist keine dauerhafte Lösung: Sie ist für
            kontinuierliche Dauerlast von 8–12 Stunden nicht ausgelegt und kann im schlimmsten Fall zur
            Brandgefahr werden. Eine dedizierte Wallbox-Installation ist die sichere, schnelle und zuverlässige
            Alternative.
          </p>
          <p>
            Wir installieren Wallboxen nach <strong>VDE 0100-722</strong> – der Norm für elektrische Anlagen
            zum Laden von Elektrofahrzeugen. Das beinhaltet die richtige Absicherung, den vorgeschriebenen
            Gleichfehlerstrom-Schutz (DC-FI, Typ B) und die korrekte Zuleitungsdimensionierung.
          </p>

          <h2>Gewerbe: Eichrechtskonforme Abrechnung</h2>
          <p>
            Wer Mitarbeitern oder Kunden das Laden berechnen möchte, braucht ein <strong>eichrechtskonformes
            Abrechnungssystem</strong>. Nur dann darf der Strom nach kWh abgerechnet werden – nicht nur
            pauschal. Wir installieren entsprechend zertifizierte Ladestationen und richte die notwendige
            Backend-Anbindung ein.
          </p>

          <h2>Dynamisches Lastmanagement</h2>
          <p>
            Wer mehrere Wallboxen installiert oder einen begrenzten Netzanschluss hat, braucht ein
            Lastmanagementsystem. Dieses verteilt die verfügbare Anschlussleistung dynamisch auf alle
            Ladepunkte – so dass kein Punkt den Anschluss überlastet, aber alle Fahrzeuge laden.
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

      <FAQ items={faqs} title="Fragen zur Wallbox" />

      <CTA
        headline="Wallbox anfragen"
        subtext="Beschreiben Sie kurz Ihre Situation – wir erstellen Ihnen rasch ein konkretes Angebot. Die Installation ist in den meisten Fällen an einem halben Tag erledigt."
      />
    </>
  )
}
