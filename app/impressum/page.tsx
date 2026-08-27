import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum von Wunderlich Elektrotechnik, Inhaber Sebastian Wunderlich, Casinostraße 2, 58452 Witten.',
  robots: { index: false },
}

export default function ImpressumPage() {
  return (
    <div className="py-20 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-primary mb-10">Impressum</h1>

        <div className="prose-content space-y-8">

          <section>
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              <strong>Wunderlich Elektrotechnik</strong><br />
              Inhaber: Sebastian Wunderlich<br />
              Casinostraße 2<br />
              58452 Witten<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2>Kontakt</h2>
            <p>
              Telefon: <a href="tel:+4915207541151" className="text-accent">0152 07541151</a><br />
              E-Mail: <a href="mailto:sebastian.wunderlich@wunderlich-elektrotechnik.de" className="text-accent">sebastian.wunderlich@wunderlich-elektrotechnik.de</a>
            </p>
          </section>

          <section>
            <h2>Steuernummer / USt-IdNr.</h2>
            <p>
              Steuernummer: 348/5226/3898<br />
              USt-IdNr.: DE463092826
            </p>
          </section>

          <section>
            <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p>
              Berufsbezeichnung: Elektrotechniker-Handwerksmeister (Industriemeister Elektrotechnik)<br />
              Zuständige Handwerkskammer: <strong>Handwerkskammer (HWK) Dortmund</strong><br />
              Eintragung in die Handwerksrolle: Ja<br />
              Verliehen in: Deutschland
            </p>
            <p>
              Die Berufsbezeichnung wurde in der Bundesrepublik Deutschland verliehen.
              Die anwendbaren berufsrechtlichen Regelungen ergeben sich insbesondere aus der
              <strong> Handwerksordnung (HwO)</strong>. Einsehbar unter:{' '}
              <a
                href="https://www.gesetze-im-internet.de/hwo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                www.gesetze-im-internet.de/hwo/
              </a>
            </p>
          </section>

          <section>
            <h2>Aufsichtsbehörde</h2>
            <p>
              Handwerkskammer Dortmund<br />
              Reinoldistraße 7–9<br />
              44135 Dortmund<br />
              <a
                href="https://www.hwk-do.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                www.hwk-do.de
              </a>
            </p>
          </section>

          <section>
            <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>
              Sebastian Wunderlich<br />
              Casinostraße 2<br />
              58452 Witten
            </p>
          </section>

          <section>
            <h2>Streitschlichtung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p>
              Ich bin nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2>Haftung für Inhalte</h2>
            <p>
              Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als
              Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte
              fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
              rechtswidrige Tätigkeit hinweisen.
            </p>
          </section>

          <section>
            <h2>Haftung für Links</h2>
            <p>
              Diese Website enthält Links zu externen Webseiten Dritter, auf deren Inhalte ich keinen
              Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen.
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
              der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2>Urheberrecht</h2>
            <p>
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
