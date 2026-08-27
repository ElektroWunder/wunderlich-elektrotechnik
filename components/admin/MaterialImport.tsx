'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Upload, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react'

interface ParsedRow {
  name: string
  unit: string
  price_per_unit: number
  category: string
  valid: boolean
  error?: string
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split('\n')
  // Erste Zeile = Header überspringen
  const rows = lines.slice(1)

  return rows.map((line) => {
    // Semikolon oder Komma als Trennzeichen
    const sep = line.includes(';') ? ';' : ','
    const cols = line.split(sep).map((c) => c.trim().replace(/^"|"$/g, ''))

    const [name, unit, priceRaw, category] = cols

    if (!name) return { name: '', unit: '', price_per_unit: 0, category: '', valid: false, error: 'Kein Name' }

    const price = parseFloat((priceRaw ?? '0').replace(',', '.')) || 0

    return {
      name,
      unit: unit || 'Stück',
      price_per_unit: price,
      category: category || '',
      valid: true,
    }
  }).filter((r) => r.name)
}

export default function MaterialImport() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [fileName, setFileName] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [imported, setImported] = useState<number | null>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setImported(null)

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setRows(parseCSV(text))
    }
    reader.readAsText(file, 'utf-8')
  }

  async function handleImport() {
    const valid = rows.filter((r) => r.valid)
    if (!valid.length) return
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.from('materials').upsert(
      valid.map(({ name, unit, price_per_unit, category }) => ({
        name,
        unit,
        price_per_unit,
        category: category || null,
      })),
      { onConflict: 'name' }
    )

    setLoading(false)
    if (!error) {
      setImported(valid.length)
      router.refresh()
    }
  }

  const validCount = rows.filter((r) => r.valid).length
  const errorCount = rows.filter((r) => !r.valid).length

  return (
    <div className="space-y-6">
      {/* Format-Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <p className="text-sm font-semibold text-blue-800 mb-2">Erwartetes CSV-Format</p>
        <pre className="text-xs text-blue-700 font-mono bg-blue-100 rounded px-3 py-2 overflow-x-auto">
{`Name;Einheit;Preis netto;Kategorie
NYM-J 3×1,5mm²;m;0.85;Kabel & Leitungen
Schuko-Steckdose;Stück;4.20;Schaltmaterial
Daikin FTXF25D;Stück;899.00;Klimatechnik`}
        </pre>
        <ul className="text-xs text-blue-600 mt-3 space-y-1">
          <li>• Trennzeichen: Semikolon <code className="bg-blue-100 px-1 rounded">;</code> oder Komma <code className="bg-blue-100 px-1 rounded">,</code></li>
          <li>• Erste Zeile wird als Header übersprungen</li>
          <li>• Preis mit Punkt oder Komma als Dezimalzeichen</li>
          <li>• Bei gleichem Namen wird der Preis aktualisiert (kein Duplikat)</li>
        </ul>
      </div>

      {/* Upload */}
      <div
        className="bg-white rounded-xl border-2 border-dashed border-gray-200 hover:border-accent/40 transition-colors p-10 text-center cursor-pointer"
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFile} />
        {fileName ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-6 h-6 text-accent" />
            <span className="text-sm font-medium text-primary">{fileName}</span>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">CSV-Datei hier ablegen oder klicken</p>
            <p className="text-xs text-gray-400 mt-1">.csv oder .txt, UTF-8</p>
          </>
        )}
      </div>

      {/* Vorschau */}
      {rows.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-primary">{rows.length} Zeilen erkannt</span>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3.5 h-3.5" /> {validCount} gültig
              </span>
              {errorCount > 0 && (
                <span className="flex items-center gap-1 text-red-500">
                  <AlertCircle className="w-3.5 h-3.5" /> {errorCount} Fehler
                </span>
              )}
            </div>
          </div>
          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Einheit</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preis</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategorie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map((row, i) => (
                  <tr key={i} className={row.valid ? '' : 'bg-red-50'}>
                    <td className="px-5 py-2.5 text-primary font-medium">{row.name || <span className="text-red-400 italic">{row.error}</span>}</td>
                    <td className="px-4 py-2.5 text-gray-500">{row.unit}</td>
                    <td className="px-4 py-2.5 text-primary text-right font-mono">{row.price_per_unit.toFixed(2)} €</td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs">{row.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {imported !== null && (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{imported} Materialien erfolgreich importiert.</span>
        </div>
      )}

      {validCount > 0 && (
        <button
          onClick={handleImport}
          disabled={loading}
          className="bg-accent hover:bg-accent-light disabled:opacity-50 text-white text-sm font-medium px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {validCount} Materialien importieren
        </button>
      )}
    </div>
  )
}
