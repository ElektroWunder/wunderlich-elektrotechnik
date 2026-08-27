'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Plus, Trash2 } from 'lucide-react'

interface Pruefung {
  datum: string; pruefer: string; kaeltemittelMenge: string
  leckagebefund: 'kein Befund' | 'Leckage' | 'Verdacht'; massnahmen: string
}

export default function PruefbuchPage() {
  const [anlagenDaten, setAnlagenDaten] = useState({
    betreiber: '', standort: '', anlagenTyp: '', fabrikat: '', baujahr: '',
    kaeltemittel: 'R-32', fuellmenge: '', co2Aequivalent: '',
    erstInbetriebnahme: '', naechstePruefung: '',
    f_gase_pflicht: true,
  })
  const [pruefungen, setPruefungen] = useState<Pruefung[]>([
    { datum: new Date().toISOString().split('T')[0], pruefer: '', kaeltemittelMenge: '', leckagebefund: 'kein Befund', massnahmen: '' },
  ])

  function updateAnlage(field: string, value: string | boolean) {
    setAnlagenDaten(p => ({ ...p, [field]: value }))
  }
  function addPruefung() {
    setPruefungen(p => [...p, { datum: new Date().toISOString().split('T')[0], pruefer: '', kaeltemittelMenge: '', leckagebefund: 'kein Befund', massnahmen: '' }])
  }
  function updatePruefung(idx: number, field: string, value: string) {
    setPruefungen(p => p.map((pr, i) => i === idx ? { ...pr, [field]: value } : pr))
  }
  function removePruefung(idx: number) {
    setPruefungen(p => p.filter((_, i) => i !== idx))
  }

  const pdfUrl = `/api/pdf/pruefbuch?data=${encodeURIComponent(JSON.stringify({ anlagenDaten, pruefungen }))}`

  const inp = (label: string, field: string, opts?: { type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={opts?.type ?? 'text'} value={anlagenDaten[field as keyof typeof anlagenDaten] as string}
        onChange={e => updateAnlage(field, e.target.value)} placeholder={opts?.placeholder}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors" />
    </div>
  )

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/dokumente" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dokumente
      </Link>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Prüfbuch Kleinkälteanlage</h1>
          <p className="text-gray-500 text-sm mt-1">EU-Verordnung Nr. 517/2014 (F-Gase) · Leckageprotokoll</p>
        </div>
        <a href={pdfUrl} target="_blank"
          className="bg-accent hover:bg-accent-light text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" /> PDF erstellen
        </a>
      </div>

      {/* Anlagendaten */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Anlagendaten</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {inp('Betreiber', 'betreiber')}
          {inp('Standort / Adresse', 'standort')}
          {inp('Anlagentyp', 'anlagenTyp', { placeholder: 'Split-Klimaanlage, Multi-Split ...' })}
          {inp('Fabrikat / Hersteller', 'fabrikat')}
          {inp('Baujahr', 'baujahr', { placeholder: '2024' })}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Kältemittel</label>
            <select value={anlagenDaten.kaeltemittel} onChange={e => updateAnlage('kaeltemittel', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50">
              {['R-32', 'R-410A', 'R-134a', 'R-407C', 'R-22', 'R-290 (Propan)', 'R-600a (Isobutan)', 'R-744 (CO₂)', 'Sonstige'].map(r =>
                <option key={r}>{r}</option>)}
            </select>
          </div>
          {inp('Füllmenge (kg)', 'fuellmenge', { placeholder: '1,2' })}
          {inp('CO₂-Äquivalent (t)', 'co2Aequivalent', { placeholder: 'wird automatisch berechnet' })}
          {inp('Erstinbetriebnahme', 'erstInbetriebnahme', { type: 'date' })}
          {inp('Nächste Pflichtprüfung', 'naechstePruefung', { type: 'date' })}
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
          <strong>Prüfpflicht gem. Art. 4 Abs. 3 EU-VO 517/2014:</strong> Anlagen ab 3 t CO₂e → jährlich; ab 30 t CO₂e → halbjährlich; ab 300 t CO₂e → vierteljährlich.
          Bei hermetisch geschlossenen Anlagen &lt; 10 t CO₂e: keine Pflichtprüfung, aber Dokumentation empfohlen.
        </div>
      </div>

      {/* Prüftabelle */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Leckageprüfungen</p>
          <button type="button" onClick={addPruefung}
            className="text-accent text-xs flex items-center gap-1 hover:underline">
            <Plus className="w-3 h-3" /> Prüfung hinzufügen
          </button>
        </div>

        <div className="space-y-4">
          {pruefungen.map((pr, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400">Prüfung #{idx + 1}</span>
                {pruefungen.length > 1 && (
                  <button type="button" onClick={() => removePruefung(idx)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Datum</label>
                  <input type="date" value={pr.datum} onChange={e => updatePruefung(idx, 'datum', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Prüfer</label>
                  <input value={pr.pruefer} onChange={e => updatePruefung(idx, 'pruefer', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
                    placeholder="Name / Zertifikat-Nr." />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kältemittel nachgefüllt (kg)</label>
                  <input value={pr.kaeltemittelMenge} onChange={e => updatePruefung(idx, 'kaeltemittelMenge', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
                    placeholder="0,0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Leckagekontrolle</label>
                  <select value={pr.leckagebefund} onChange={e => updatePruefung(idx, 'leckagebefund', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50">
                    <option>kein Befund</option>
                    <option>Leckage</option>
                    <option>Verdacht</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Maßnahmen</label>
                  <input value={pr.massnahmen} onChange={e => updatePruefung(idx, 'massnahmen', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50"
                    placeholder="Reparatur, Nachfüllung, keine Maßnahmen..." />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
