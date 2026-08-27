'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Plus, Trash2 } from 'lucide-react'

type Variant = 'klein' | 'gross'
type Ergebnis = 'i.O.' | 'n.i.O.' | 'n.a.'

interface Stromkreis {
  nr: string
  bezeichnung: string
  sicherung: string
  schutzleiterR: string    // Ω
  isolationR: string       // MΩ
  schleifenimpedanz: string // Ω
  kurzschlussstrom: string  // A
  rcdNennstrom: string     // mA
  rcdAusloesezeit: string  // ms
  ergebnis: Ergebnis
}

const defaultStromkreis = (): Stromkreis => ({
  nr: '', bezeichnung: '', sicherung: '',
  schutzleiterR: '', isolationR: '', schleifenimpedanz: '',
  kurzschlussstrom: '', rcdNennstrom: '', rcdAusloesezeit: '',
  ergebnis: 'i.O.',
})

export default function ECheckPage() {
  const [variant, setVariant] = useState<Variant>('klein')
  const [form, setForm] = useState({
    prueferName: '', prueferQualifikation: 'Elektrofachkraft',
    anlagenBetreiber: '', anlagenStandort: '',
    pruefDatum: new Date().toISOString().split('T')[0],
    naechstePruefung: '',
    nennspannung: '230/400 V',
    nennfrequenz: '50 Hz',
    bemerkungen: '',
    sichtpruefungOk: true, isolationOk: true, schutzleiterOk: true,
    fehlerstromOk: true, funktionOk: true, kennzeichnungOk: true,
    gesamtergebnis: 'bestanden' as 'bestanden' | 'nicht bestanden' | 'mit Mängeln',
  })
  const [betriebsmittel, setBetriebsmittel] = useState([
    { bezeichnung: '', fabrikat: '', typ: '', serienNr: '', ergebnis: 'i.O.' as string },
  ])
  const [stromkreise, setStromkreise] = useState<Stromkreis[]>([defaultStromkreis()])

  function updateForm(field: string, value: string | boolean) {
    setForm(p => ({ ...p, [field]: value }))
  }
  function updateBM(idx: number, field: string, value: string) {
    setBetriebsmittel(p => p.map((b, i) => i === idx ? { ...b, [field]: value } : b))
  }
  function addBM() {
    setBetriebsmittel(p => [...p, { bezeichnung: '', fabrikat: '', typ: '', serienNr: '', ergebnis: 'i.O.' }])
  }
  function removeBM(idx: number) {
    setBetriebsmittel(p => p.filter((_, i) => i !== idx))
  }
  function updateSK(idx: number, field: string, value: string) {
    setStromkreise(p => p.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }
  function addSK() { setStromkreise(p => [...p, defaultStromkreis()]) }
  function removeSK(idx: number) { setStromkreise(p => p.filter((_, i) => i !== idx)) }

  const pdfUrl = `/api/pdf/echeck?variant=${variant}&data=${encodeURIComponent(JSON.stringify({ form, betriebsmittel, stromkreise }))}`

  const inp = (label: string, field: string, opts?: { type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={opts?.type ?? 'text'} value={form[field as keyof typeof form] as string}
        onChange={e => updateForm(field, e.target.value)} placeholder={opts?.placeholder}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors" />
    </div>
  )

  const skInput = (idx: number, field: keyof Stromkreis, placeholder?: string) => (
    <input
      value={stromkreise[idx][field]}
      onChange={e => updateSK(idx, field, e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-100 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-accent/50 bg-white"
    />
  )

  return (
    <div className="p-8 max-w-6xl">
      <Link href="/admin/dokumente" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dokumente
      </Link>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">E-Check Protokoll</h1>
          <p className="text-gray-500 text-sm mt-1">DGUV Vorschrift 3 · VDE 0701-0702</p>
        </div>
        <a href={pdfUrl} target="_blank"
          className="bg-accent hover:bg-accent-light text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" /> PDF erstellen
        </a>
      </div>

      {/* Variante */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Prüfungsumfang</p>
        <div className="grid grid-cols-2 gap-3">
          {(['klein', 'gross'] as Variant[]).map(v => (
            <button key={v} type="button" onClick={() => setVariant(v)}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${variant === v ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'}`}>
              <p className="font-semibold text-sm text-primary">{v === 'klein' ? 'E-Check Klein' : 'E-Check Groß'}</p>
              <p className="text-xs text-gray-500 mt-1">
                {v === 'klein' ? 'Ortsfeste Anlage, wenige Betriebsmittel, § 5 DGUV V3' : 'Umfangreiche Prüfung mit vollständigem Messprotokoll'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Prüfer & Anlage */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Prüfer & Anlage</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {inp('Name des Prüfers', 'prueferName')}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Qualifikation</label>
            <select value={form.prueferQualifikation} onChange={e => updateForm('prueferQualifikation', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50">
              <option>Elektrofachkraft</option>
              <option>Elektrisch unterwiesene Person</option>
              <option>Sachverständiger</option>
            </select>
          </div>
          {inp('Anlagenbetreiber', 'anlagenBetreiber')}
          {inp('Standort der Anlage', 'anlagenStandort')}
          {inp('Prüfdatum', 'pruefDatum', { type: 'date' })}
          {inp('Nächste Prüfung', 'naechstePruefung', { type: 'date' })}
          {inp('Nennspannung', 'nennspannung', { placeholder: '230/400 V' })}
          {inp('Nennfrequenz', 'nennfrequenz', { placeholder: '50 Hz' })}
        </div>
      </div>

      {/* Stromkreise */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stromkreise & Messwerte</p>
            <p className="text-xs text-gray-400 mt-0.5">Alle Messwerte gemäß VDE 0100-600</p>
          </div>
          <button type="button" onClick={addSK}
            className="flex items-center gap-1.5 text-accent text-xs font-medium hover:underline">
            <Plus className="w-3.5 h-3.5" /> Stromkreis hinzufügen
          </button>
        </div>

        <div className="space-y-3">
          {stromkreise.map((sk, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400">Stromkreis #{idx + 1}</span>
                {stromkreise.length > 1 && (
                  <button type="button" onClick={() => removeSK(idx)} className="text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Grunddaten */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Nr.</label>
                  {skInput(idx, 'nr', 'L1, L2...')}
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Bezeichnung</label>
                  {skInput(idx, 'bezeichnung', 'Licht EG, Steckdosen UG...')}
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Sicherung / Schutzorgan</label>
                {skInput(idx, 'sicherung', 'B16A, C25A, FI 40/0,03...')}
              </div>

              {/* Messwerte */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Schutzleiter R (Ω)</label>
                  {skInput(idx, 'schutzleiterR', '≤ 0,3')}
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Isolation R (MΩ)</label>
                  {skInput(idx, 'isolationR', '≥ 1,0')}
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Schleifenimpedanz (Ω)</label>
                  {skInput(idx, 'schleifenimpedanz', '0,00')}
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Kurzschlussstrom (A)</label>
                  {skInput(idx, 'kurzschlussstrom', '0')}
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">RCD Nennstrom (mA)</label>
                  {skInput(idx, 'rcdNennstrom', '30')}
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">RCD Auslösezeit (ms)</label>
                  {skInput(idx, 'rcdAusloesezeit', '≤ 300')}
                </div>
              </div>

              {/* Ergebnis */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Ergebnis:</span>
                {(['i.O.', 'n.i.O.', 'n.a.'] as Ergebnis[]).map(val => (
                  <button key={val} type="button" onClick={() => updateSK(idx, 'ergebnis', val)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      sk.ergebnis === val
                        ? val === 'i.O.' ? 'bg-green-500 text-white border-green-500'
                          : val === 'n.i.O.' ? 'bg-red-500 text-white border-red-500'
                          : 'bg-gray-400 text-white border-gray-400'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Allgemeine Prüfergebnisse */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Allgemeine Prüfergebnisse</p>
        <div className="space-y-3">
          {[
            { field: 'sichtpruefungOk', label: 'Sichtprüfung (Zustand, Isolierung, Beschädigungen)' },
            { field: 'isolationOk', label: 'Isolationswiderstand (≥ 1 MΩ zwischen L/N und PE)' },
            { field: 'schutzleiterOk', label: 'Schutzleiterwiderstand (≤ 0,3 Ω, bei Verlängerung ≤ 1 Ω)' },
            { field: 'fehlerstromOk', label: 'Fehlerstrom-Schutzeinrichtung RCD (Auslösezeit ≤ 300 ms)' },
            { field: 'funktionOk', label: 'Funktionsprüfung (Gerät/Anlage im Betrieb)' },
            { field: 'kennzeichnungOk', label: 'Kennzeichnung, Dokumentation und Schaltpläne' },
          ].map(({ field, label }) => (
            <div key={field} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{label}</span>
              <div className="flex gap-2">
                {['i.O.', 'n.i.O.'].map(val => (
                  <button key={val} type="button"
                    onClick={() => updateForm(field, val === 'i.O.')}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      (form[field as keyof typeof form] === true && val === 'i.O.') ||
                      (form[field as keyof typeof form] === false && val === 'n.i.O.')
                        ? val === 'i.O.' ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gesamtergebnis</label>
          <div className="flex gap-3">
            {(['bestanden', 'mit Mängeln', 'nicht bestanden'] as const).map(v => (
              <button key={v} type="button" onClick={() => updateForm('gesamtergebnis', v)}
                className={`text-sm px-4 py-2 rounded-lg border-2 transition-colors ${
                  form.gesamtergebnis === v
                    ? v === 'bestanden' ? 'border-green-500 bg-green-50 text-green-700'
                      : v === 'mit Mängeln' ? 'border-amber-400 bg-amber-50 text-amber-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}>
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
                <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-2">Bezeichnung</th>
                <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-2">Fabrikat</th>
                <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-2">Typ/Modell</th>
                <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-2">Serien-Nr.</th>
                <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-2">Ergebnis</th>
                <th className="pb-2"></th>
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
                  <td className="py-2 pr-2">
                    <select value={bm.ergebnis} onChange={e => updateBM(idx, 'ergebnis', e.target.value)}
                      className="border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-accent/50">
                      <option>i.O.</option><option>n.i.O.</option><option>n.a.</option>
                    </select>
                  </td>
                  <td className="py-2">
                    {betriebsmittel.length > 1 && (
                      <button type="button" onClick={() => removeBM(idx)} className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
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
