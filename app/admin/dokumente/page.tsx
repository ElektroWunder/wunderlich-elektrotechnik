import Link from 'next/link'
import { FileCheck, Thermometer, ChevronRight } from 'lucide-react'

export const metadata = { title: 'Dokumente – Wunderlich Admin' }

const docs = [
  {
    href: '/admin/dokumente/echeck',
    icon: FileCheck,
    title: 'E-Check Protokoll',
    description: 'Prüfprotokoll für elektrische Anlagen nach DGUV V3 / VDE 0701-0702',
    variants: ['Klein (wenige Betriebsmittel)', 'Groß (umfangreiche Anlage)'],
    color: 'bg-blue-50 text-blue-500',
  },
  {
    href: '/admin/dokumente/pruefbuch',
    icon: Thermometer,
    title: 'Prüfbuch Kleinkälteanlage',
    description: 'Wartungs- und Leckage-Prüfbuch gem. EU-Verordnung 517/2014 (F-Gase)',
    variants: ['A4-Vorlage mit Anlagendaten + Prüftabelle'],
    color: 'bg-teal-50 text-teal-500',
  },
]

export const dynamic = 'force-dynamic'

export default function DokumentePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Dokumente & Vorlagen</h1>
        <p className="text-gray-500 text-sm mt-1">Prüfprotokolle und gesetzlich vorgeschriebene Dokumentationsvorlagen</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {docs.map((doc) => (
          <Link
            key={doc.href}
            href={doc.href}
            className="bg-white rounded-xl border border-gray-100 p-6 hover:border-accent/30 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${doc.color}`}>
                <doc.icon className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-accent transition-colors mt-1" />
            </div>
            <h2 className="font-semibold text-primary mb-1.5">{doc.title}</h2>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">{doc.description}</p>
            <div className="space-y-1">
              {doc.variants.map((v) => (
                <div key={v} className="text-xs text-gray-400 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  {v}
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
