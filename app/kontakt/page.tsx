import type { Metadata } from 'next'
import { Phone, MapPin, Clock, AlertTriangle, ExternalLink } from 'lucide-react'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Kontakt – Beratung anfragen',
  description:
    'Kontakt zu Wunderlich Elektrotechnik: Telefon 0152 07541151, Witten. Beratung und Angebotserstellung für Witten und Umgebung.',
}

export default function KontaktPage() {
  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
            Kontakt aufnehmen
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Beschreiben Sie Ihr Vorhaben – wir melden uns innerhalb von 24 Stunden.
            Vor-Ort-Besichtigung und schriftliches Angebot.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Kontaktformular */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Anfrage senden</h2>
            <ContactForm />
          </div>

          {/* Kontaktinfos */}
          <div className="space-y-6">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-primary mb-6">Direkt Kontakt</h2>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-0.5">Telefon</p>
                    <a
                      href="tel:+4915207541151"
                      className="text-primary font-bold text-lg hover:text-accent transition-colors"
                    >
                      0152 07541151
                    </a>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Erreichbarkeit nach Vereinbarung
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-0.5">Standort</p>
                    <p className="text-primary font-medium">
                      Wunderlich Elektrotechnik<br />
                      58452 Witten<br />
                      Ennepe-Ruhr-Kreis, NRW
                    </p>
                    <a
                      href="https://maps.google.com/?q=Witten,+Ennepe-Ruhr-Kreis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-accent hover:underline mt-1"
                    >
                      In Google Maps öffnen <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">Erreichbarkeit</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Terminvereinbarung per Telefon oder Kontaktformular.
                      Wir melden uns in der Regel innerhalb von 24 Stunden.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-accent/5 rounded-xl border border-accent/20">
                  <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-primary text-sm">Notfall</p>
                    <p className="text-gray-600 text-sm mt-0.5">
                      Bei dringenden Elektroproblemen rufen Sie direkt an – wir melden
                      uns schnellstmöglich zurück.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Servicegebiet */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-primary mb-3">Servicegebiet</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Schwerpunkt Witten – der genaue Einsatzbereich richtet sich nach dem Auftrag. Sprechen Sie uns einfach an.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
