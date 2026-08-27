'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'

type Variant = 'klein' | 'gross'

export default function ECheckPage() {
  const [variant, setVariant] = useState<Variant>('klein')
  const [form, setForm] = useState({
    prueferName: '', prueferQualifikation: 'Elektrofachkraft',
    anlagenBetreiber: '', anlagenStandort: '',
    pruefDatum: new Date().toISOString().split('T')[0],
    naechstePruefung: '',
    bemerkungen: '',
    // Ergebnisse
    sichtpruefungOk: true, isolationOk: true, schutzleiterOk: true,
    fehlerstromOk: true, funktionOk: true, kennzeichnungOk: true,
    gesamtergebnis: 'bestanden' as 'bestanden' | 'nicht bestanden' | 'mit Mängeln',
  })
  const [betriebsmittel, setBetriebsmittel] = useState([
    { bezeichnung: '', fabrikat: '', typ: '', serienNr: '', ergebnis: 'i.O.' as string },
  ])

  function updateForm(field: string, value: string | boolean) {
    setForm(p => ({ ...p, [field]: value }))
  }
  function updateBM(idx: number, field: string, value: string) {
    setBetriebsmittel(p => p.map((b, i) => i === idx ? { ...b, [field]: value } : b))
  }
  function addBM() {
    setBetriebsmittel(p => [...p, { bezeichnung: '', fabrikat: '', typ: '', serienNr: '', ergebnis: 'i.O.' }])
  }

  const pdfUrl = `/api/pdf/echeck?variant=${variant}&data=${encodeURIComponent(JSON.stringify({ form, betriebsmittel }))}`

  const input = (label: string, field: string, opts?: { type?: string; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
        {label}{opts?.required ? ' *' : ''}
      </label>
      <input
        type={opts?.type ?? 'text'}
        value={form[field as keyof typeof form] as string}
        onChange={e => updateForm(field, e.target.value)}
        placeholder={opts?.placeholder}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
      />
    </div>
  )

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/dokumente" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dokumente
      </Link>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">E-Check Protokoll</h1>
          <p className="text-gray-500 text-sm mt-1">DGUV V3 / VDE 0701-0702</p>
        </div>
        <a
          href={pdfUrl}
          target="_blank"
          className="bg-accent hover:bg-accent-light text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> PDF erstellen
        </a>
      </div>

      {/* Variante */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Prüfungsumfang</p>
        <div className="grid grid-cols-2 gap-3">
          {(['klein', 'gross'] as Variant[]).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${variant === v ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <p className="font-semibold text-sm text-primary">{v === 'klein' ? 'E-Check Klein' : 'E-Check Groß'}</p>
              <p className="text-xs text-gray-500 mt-1">
                {v === 'klein' ? 'Ortsfeste Anlage, wenige Betriebsmittel, § 5 DGUV V3' : 'Umfangreiche Prüfung mit Messprotokoll, alle Abschnitte'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Prüfer & Anlage */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Prüfer & Anlage</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {input('Name des Prüfers', 'prueferName', { required: true })}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Qualifikation</label>
            <select value={form.prueferQualifikation} onChange={e => updateForm('prueferQualifikation', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50">
              <option>Elektrofachkraft</option>
              <option>Elektrisch unterwiesene Person</option>
              <option>Sachverständiger</option>
            </select>
          </div>
          {input('Anlagenbetreiber', 'anlagenBetreiber', { required: true })}
          {input('Standort der Anlage', 'anlagenStandort')}
          {input('Prüfdatum', 'pruefDatum', { type: 'date', required: true })}
          {input('Nächste Prüfung', 'naechstePruefung', { type: 'date' })}
        </div>
      </div>

      {/* Prüfergebnisse */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Prüfergebnisse</p>
        <div className="space-y-3">
          {[
            { field: 'sichtpruefungOk', label: 'Sichtprüfung (Zustand, Beschädigungen)' },
            { field: 'isolationOk', label: 'Isolationswiderstand (≥ 1 MΩ)' },
            { field: 'schutzleiterOk', label: 'Schutzleiterwiderstand (≤ 0,3 Ω)' },
            { field: 'fehlerstromOk', label: 'Fehlerstrom-Schutzeinrichtung (RCD-Test)' },
            { field: 'funktionOk', label: 'Funktionsprüfung' },
            { field: 'kennzeichnungOk', label: 'Kennzeichnung und Dokumentation' },
          ].map(({ field, label }) => (
            <div key={field} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{label}</span>
              <div className="flex gap-2">
                {['i.O.', 'n.i.O.', 'n.a.'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => updateForm(field, val === 'i.O.')}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      (form[field as keyof typeof form] === true && val === 'i.O.') ||
                      (form[field as keyof typeof form] === false && val === 'n.i.O.')
                        ? val === 'i.O.' ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Gesamtergebnis</label>
          <div className="flex gap-3">
            {(['bestanden', 'mit Mängeln', 'nicht bestanden'] as const).map(v => (
              <button key={v} type="button" onClick={() => updateForm('gesamtergebnis', v)}
                className={`text-sm px-4 py-2 rounded-lg border-2 transition-colors ${
                  form.gesamtergebnis === v
                    ? v === 'bestanden' ? 'border-green-500 bg-green-50 text-green-700'
                      : v === 'mit Mängeln' ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Betriebsmittel */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Geprüfte Betriebsmittel</p>
          <button type="button" onClick={addBM} className="text-accent text-xs hover:underline">+ Zeile hinzufügen</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 pb-2">Bezeichnung</th>
                <th className="text-left text-xs font-semibold text-gray-400 pb-2">Fabrikat</th>
                <th className="text-left text-xs font-semibold text-gray-400 pb-2">Typ/Modell</th>
                <th className="text-left text-xs font-semibold text-gray-400 pb-2">Serien-Nr.</th>
                <th className="text-left text-xs font-semibold text-gray-400 pb-2">Ergebnis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {betriebsmittel.map((bm, idx) => (
                <tr key={idx}>
                  {(['bezeichnung', 'fabrikat', 'typ', 'serienNr'] as const).map(f => (
                    <td key={f} className="py-2 pr-2">
                      <input value={bm[f]} onChange={e => updateBM(idx, f, e.target.value)}
                        className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-accent/50" />
                    </td>
                  ))}
                  <td className="py-2">
                    <select value={bm.ergebnis} onChange={e => updateBM(idx, 'ergebnis', e.target.value)}
                      className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-accent/50">
                      <option>i.O.</option>
                      <option>n.i.O.</option>
                      <option>n.a.</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bemerkungen */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Bemerkungen / Mängel</p>
        <textarea rows={3} value={form.bemerkungen} onChange={e => updateForm('bemerkungen', e.target.value)}
          placeholder="Festgestellte Mängel, Empfehlungen, Hinweise..."
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 resize-none" />
      </div>
    </div>
  )
}
