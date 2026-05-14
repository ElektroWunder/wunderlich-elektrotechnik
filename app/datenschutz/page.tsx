import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung von Wunderlich Elektrotechnik gemäß DSGVO.',
  robots: { index: false },
}

export default function DatenschutzPage() {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-primary mb-10">Datenschutzerklärung</h1>

        <div className="prose-content space-y-8">

          <section>
            <h2>1. Datenschutz auf einen Blick</h2>
            <h3>Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
              personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
              Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
            <h3>Datenerfassung auf dieser Website</h3>
            <p>
              <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
              Kontaktdaten entnehmen Sie dem Impressum dieser Website.
            </p>
            <p>
              <strong>Wie erfasse ich Ihre Daten?</strong><br />
              Ihre Daten werden zum einen dadurch erhoben, dass Sie mir diese mitteilen – z. B. durch
              das Ausfüllen des Kontaktformulars. Andere Daten werden automatisch oder nach Ihrer
              Einwilligung beim Besuch der Website durch meine IT-Systeme erfasst. Das sind vor allem
              technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
            </p>
          </section>

          <section>
            <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3>Datenschutz</h3>
            <p>
              Der Betreiber dieser Seiten nimmt den Schutz Ihrer persönlichen Daten sehr ernst.
              Ich behandle Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <h3>Verantwortliche Stelle</h3>
            <p>
              Verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
              Wunderlich Elektrotechnik<br />
              Sebastian Wunderlich<br />
              Casinostraße 2<br />
              58452 Witten<br />
              Telefon: +49 XXX XXXXXXXX
            </p>
            <h3>Speicherdauer</h3>
            <p>
              Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt
              wurde, verbleiben Ihre personenbezogenen Daten bei mir, bis der Zweck für die
              Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen
              oder die Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht,
              sofern keine anderen rechtlich zulässigen Gründe für die Speicherung bestehen.
            </p>
            <h3>Ihre Rechte</h3>
            <p>
              Sie haben gegenüber mir folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:
              Recht auf Auskunft (Art. 15 DSGVO), Recht auf Berichtigung (Art. 16 DSGVO),
              Recht auf Löschung (Art. 17 DSGVO), Recht auf Einschränkung der Verarbeitung
              (Art. 18 DSGVO), Recht auf Datenübertragbarkeit (Art. 20 DSGVO) sowie
              Widerspruchsrecht (Art. 21 DSGVO).
            </p>
            <p>
              Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die
              Verarbeitung Ihrer personenbezogenen Daten durch mich zu beschweren. Die zuständige
              Aufsichtsbehörde in NRW ist: Landesbeauftragte für Datenschutz und Informationsfreiheit
              NRW (LDI NRW), Kavalleriestraße 2–4, 40213 Düsseldorf.
            </p>
          </section>

          <section>
            <h2>3. Datenerfassung auf dieser Website</h2>
            <h3>Server-Log-Dateien</h3>
            <p>
              Der Provider der Website erhebt und speichert automatisch Informationen in sogenannten
              Server-Log-Dateien. Dies sind: Browsertyp und -version, verwendetes Betriebssystem,
              Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse.
              Eine Zusammenführung dieser Daten mit anderen Datenquellen findet nicht statt.
            </p>
            <p>
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem Betrieb).
            </p>

            <h3>Kontaktformular</h3>
            <p>
              Wenn Sie mir per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem
              Anfrageformular inklusive der von Ihnen angegebenen Kontaktdaten zur Bearbeitung der
              Anfrage und für den Fall von Anschlussfragen bei mir gespeichert. Diese Daten gebe ich
              nicht ohne Ihre Einwilligung weiter.
            </p>
            <p>
              Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung)
              sowie Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Ihre Einwilligung können Sie jederzeit
              widerrufen. Die Daten aus dem Kontaktformular werden gelöscht, sobald die Anfrage
              vollständig bearbeitet ist und keine gesetzliche Aufbewahrungspflicht besteht.
            </p>
            <p>
              Die Übertragung der Formulardaten erfolgt über den E-Mail-Dienst{' '}
              <strong>Resend</strong> (Resend, Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA).
              Resend hat sich dem EU-US Data Privacy Framework verpflichtet. Die Datenschutzerklärung
              von Resend finden Sie unter:{' '}
              <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                resend.com/legal/privacy-policy
              </a>.
            </p>

            <h3>Cookies</h3>
            <p>
              Diese Website verwendet ausschließlich technisch notwendige Cookies und localStorage zur
              Speicherung Ihrer Cookie-Einwilligung. Es werden keine Tracking-Cookies, keine
              Analyse-Cookies und keine Werbe-Cookies eingesetzt.
            </p>
            <p>
              Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am Betrieb der Website).
            </p>

            <h3>Google Maps</h3>
            <p>
              Diese Website nutzt Google Maps zur Darstellung einer interaktiven Karte. Google Maps
              wird erst nach Ihrer ausdrücklichen Einwilligung geladen (Two-Click-Lösung). Bis zur
              Einwilligung wird kein Kontakt zu Google-Servern aufgebaut.
            </p>
            <p>
              Wenn Sie einwilligen, werden Daten an Google LLC, 1600 Amphitheatre Parkway, Mountain
              View, CA 94043, USA übermittelt. Google Ireland Limited, Gordon House, Barrow Street,
              Dublin 4, Irland ist für europäische Nutzer verantwortlich. Rechtsgrundlage: Art. 6 Abs.
              1 lit. a DSGVO. Ihre Einwilligung können Sie jederzeit widerrufen (Cookie-Banner).
            </p>
            <p>
              Weitere Informationen: {' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                policies.google.com/privacy
              </a>
            </p>
          </section>

          <section>
            <h2>4. Hosting</h2>
            <p>
              Diese Website wird bei <strong>Vercel Inc.</strong> (340 Pine Street, Suite 701,
              San Francisco, California 94104, USA) gehostet. Vercel hat sich dem EU-US Data Privacy
              Framework verpflichtet. Beim Aufruf der Website werden automatisch Server-Log-Daten
              erhoben. Weitere Informationen:{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                vercel.com/legal/privacy-policy
              </a>
            </p>
          </section>

          <p className="text-sm text-gray-400">
            Stand: {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
