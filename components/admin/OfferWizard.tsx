'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle, Plus, Trash2, GripVertical } from 'lucide-react'
import type { OfferType } from '@/lib/supabase/types'

interface Customer { id: string; name: string; company: string | null }
interface Block { id: string; name: string; description: string | null; offer_block_items: BlockItem[] }
interface BlockItem {
  id: string; type: string; description: string; quantity: number | null
  unit: string | null; unit_price: number | null; labor_hours: number | null; position: number | null
}
interface OfferItem {
  id: string; type: 'material' | 'labor' | 'heading' | 'text'
  description: string; quantity: number | null; unit: string | null
  unit_price: number | null; labor_hours: number | null
}

interface Props {
  customers: Customer[]
  blocks: Block[]
  preselectedCustomerId?: string
}

function newItem(type: OfferItem['type'] = 'material'): OfferItem {
  return { id: crypto.randomUUID(), type, description: '', quantity: 1, unit: 'Stück', unit_price: null, labor_hours: null }
}

const STEP_LABELS = ['Grunddaten', 'Typ', 'Positionen', 'Überprüfen']

export default function OfferWizard({ customers, blocks, preselectedCustomerId }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  // Step 0: Grunddaten
  const [customerId, setCustomerId] = useState(preselectedCustomerId ?? '')
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [hourlyRate, setHourlyRate] = useState('65')
  const [validDays, setValidDays] = useState('30')

  // Step 1: Typ (Besichtigung → Typ)
  const [hadInspection, setHadInspection] = useState<boolean | null>(null)
  const [inspectionDate, setInspectionDate] = useState('')
  const [offerType, setOfferType] = useState<OfferType | null>(null)

  // Step 2: Positionen
  const [items, setItems] = useState<OfferItem[]>([newItem()])
  const [discount, setDiscount] = useState('0')

  function addItem(type: OfferItem['type']) {
    setItems((p) => [...p, newItem(type)])
  }
  function removeItem(id: string) {
    setItems((p) => p.filter((i) => i.id !== id))
  }
  function updateItem(id: string, field: string, value: string | number | null) {
    setItems((p) => p.map((i) => i.id === id ? { ...i, [field]: value } : i))
  }
  function addBlock(block: Block) {
    const blockItems: OfferItem[] = block.offer_block_items
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((bi) => ({
        id: crypto.randomUUID(),
        type: bi.type as OfferItem['type'],
        description: bi.description,
        quantity: bi.quantity,
        unit: bi.unit,
        unit_price: bi.unit_price,
        labor_hours: bi.labor_hours,
      }))
    setItems((p) => [...p, ...blockItems])
  }

  function calcTotal() {
    const mat = items.filter(i => i.type === 'material').reduce((s, i) => s + (i.quantity ?? 0) * (i.unit_price ?? 0), 0)
    const labor = items.filter(i => i.type === 'labor').reduce((s, i) => s + (i.labor_hours ?? 0) * parseFloat(hourlyRate || '0'), 0)
    const sub = mat + labor
    const disc = sub * (parseFloat(discount || '0') / 100)
    const net = sub - disc
    const vat = net * 0.19
    return { mat, labor, sub, disc, net, vat, gross: net + vat }
  }

  function canProceed() {
    if (step === 0) return customerId && title.trim()
    if (step === 1) return offerType !== null
    if (step === 2) return items.some(i => i.description.trim())
    return true
  }

  async function handleSave() {
    setLoading(true)
    const supabase = createClient()

    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + parseInt(validDays || '30'))

    const { data: offer, error } = await supabase
      .from('offers')
      .insert({
        customer_id: customerId,
        title: title.trim(),
        type: offerType!,
        status: 'entwurf',
        inspection_date: hadInspection ? inspectionDate || null : null,
        valid_until: validUntil.toISOString().split('T')[0],
        discount_percent: parseFloat(discount) || 0,
        hourly_rate: parseFloat(hourlyRate) || null,
        notes: notes.trim() || null,
      })
      .select('id')
      .single()

    if (error || !offer) { setLoading(false); return }

    await supabase.from('offer_items').insert(
      items.map((item, idx) => ({ ...item, offer_id: offer.id, position: idx }))
    )

    router.push(`/admin/angebote/${offer.id}`)
    router.refresh()
  }

  const totals = calcTotal()
  const selectedCustomer = customers.find(c => c.id === customerId)

  return (
    <div>
      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {STEP_LABELS.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i < step ? 'bg-green-500 text-white' : i === step ? 'bg-accent text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm ${i === step ? 'text-primary font-medium' : 'text-gray-400'}`}>{label}</span>
            {i < STEP_LABELS.length - 1 && <div className="w-8 h-px bg-gray-200 mx-1" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        {/* STEP 0: Grunddaten */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-primary">Grunddaten</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Kunde *</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
              >
                <option value="">— Kunden wählen —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.company ? ` (${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Titel / Betreff *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="z.B. Klimaanlage Wohnzimmer, Split 3,5 kW"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Stundensatz netto (€)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Gültig (Tage)</label>
                <input
                  type="number"
                  value={validDays}
                  onChange={(e) => setValidDays(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Notizen (intern)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 1: Angebotstyp */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="font-semibold text-primary">Angebotstyp</h2>
            <div>
              <p className="text-sm font-medium text-primary mb-3">Hat eine Vor-Ort-Besichtigung stattgefunden?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setHadInspection(false); setOfferType('schaetzung') }}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${
                    hadInspection === false ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-sm text-primary">Nein</p>
                  <p className="text-xs text-gray-500 mt-1">→ Schätzung (unverbindlich)</p>
                </button>
                <button
                  type="button"
                  onClick={() => { setHadInspection(true); setOfferType(null) }}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${
                    hadInspection === true ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-sm text-primary">Ja</p>
                  <p className="text-xs text-gray-500 mt-1">→ KVA oder Festpreis</p>
                </button>
              </div>
            </div>

            {hadInspection === false && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <strong>Hinweis Schätzung:</strong> Eine Schätzung ist unverbindlich (±30% Abweichung möglich).
                Für ein verbindliches Angebot bitte Vor-Ort-Besichtigung vereinbaren.
              </div>
            )}

            {hadInspection === true && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Besichtigungsdatum</label>
                  <input
                    type="date"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                <p className="text-sm font-medium text-primary">Art des Angebots:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOfferType('kva')}
                    className={`p-4 rounded-xl border-2 text-left transition-colors ${
                      offerType === 'kva' ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-sm text-primary">Kostenvoranschlag</p>
                    <p className="text-xs text-gray-500 mt-1">±15% lt. § 632 BGB</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOfferType('festpreis')}
                    className={`p-4 rounded-xl border-2 text-left transition-colors ${
                      offerType === 'festpreis' ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-sm text-primary">Festpreis</p>
                    <p className="text-xs text-gray-500 mt-1">Bindend, keine Abweichung</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Positionen */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-primary">Positionen</h2>
            </div>

            {/* Bausteine */}
            {blocks.length > 0 && (
              <div className="mb-5 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Baustein einfügen</p>
                <div className="flex flex-wrap gap-2">
                  {blocks.map((block) => (
                    <button
                      key={block.id}
                      type="button"
                      onClick={() => addBlock(block)}
                      className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:border-accent/40 hover:bg-accent/5 transition-colors text-gray-700"
                    >
                      + {block.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Positionsliste */}
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <GripVertical className="w-4 h-4 text-gray-300 mt-2.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                      {(['material', 'labor', 'heading', 'text'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => updateItem(item.id, 'type', t)}
                          className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${
                            item.type === t ? 'bg-accent text-white border-accent' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {t === 'material' ? 'Material' : t === 'labor' ? 'Lohn' : t === 'heading' ? 'Überschrift' : 'Text'}
                        </button>
                      ))}
                    </div>

                    <div className={`grid gap-2 ${item.type === 'material' ? 'grid-cols-[2fr_1fr_1fr_1fr]' : 'grid-cols-1'}`}>
                      <input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white"
                        placeholder={item.type === 'heading' ? 'Überschrift …' : item.type === 'labor' ? 'Lohnposition …' : 'Bezeichnung …'}
                      />
                      {item.type === 'material' && (
                        <>
                          <input type="number" placeholder="Menge" value={item.quantity ?? ''} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white font-mono" />
                          <input placeholder="Einheit" value={item.unit ?? ''} onChange={(e) => updateItem(item.id, 'unit', e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white" />
                          <input type="number" placeholder="EP €" value={item.unit_price ?? ''} onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white font-mono" />
                        </>
                      )}
                      {item.type === 'labor' && (
                        <input type="number" step="0.25" placeholder="Stunden" value={item.labor_hours ?? ''} onChange={(e) => updateItem(item.id, 'labor_hours', parseFloat(e.target.value))} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white font-mono w-40" />
                      )}
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors mt-2 shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-6">
              {(['material', 'labor', 'heading', 'text'] as const).map((t) => (
                <button key={t} type="button" onClick={() => addItem(t)} className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> {t === 'material' ? 'Material' : t === 'labor' ? 'Lohn' : t === 'heading' ? 'Überschrift' : 'Text'}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600">Rabatt (%)</label>
                <input type="number" min="0" max="100" step="1" value={discount} onChange={(e) => setDiscount(e.target.value)}
                  className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none font-mono" />
              </div>
              <div className="text-sm space-y-1 text-gray-500">
                <div className="flex justify-between"><span>Material netto</span><span className="font-mono">{totals.mat.toFixed(2)} €</span></div>
                <div className="flex justify-between"><span>Lohn netto ({totals.labor > 0 ? `${items.filter(i=>i.type==='labor').reduce((s,i)=>s+(i.labor_hours??0),0)} h × ${hourlyRate} €` : '–'})</span><span className="font-mono">{totals.labor.toFixed(2)} €</span></div>
                {totals.disc > 0 && <div className="flex justify-between text-red-500"><span>Rabatt {discount}%</span><span className="font-mono">−{totals.disc.toFixed(2)} €</span></div>}
                <div className="flex justify-between"><span>MwSt. 19%</span><span className="font-mono">{totals.vat.toFixed(2)} €</span></div>
                <div className="flex justify-between font-semibold text-primary border-t border-gray-200 pt-2 mt-1">
                  <span>Gesamt brutto</span><span className="font-mono">{totals.gross.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Überprüfen */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-semibold text-primary">Überprüfen & Speichern</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Kunde</p><p className="font-medium text-primary">{selectedCustomer?.name}</p></div>
              <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Titel</p><p className="font-medium text-primary">{title}</p></div>
              <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Typ</p>
                <p className="font-medium text-primary">
                  {offerType === 'schaetzung' ? 'Schätzung' : offerType === 'kva' ? 'Kostenvoranschlag' : 'Festpreis'}
                </p>
              </div>
              <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Positionen</p><p className="font-medium text-primary">{items.length}</p></div>
              <div><p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Gesamtbetrag brutto</p><p className="font-mono font-bold text-primary text-lg">{totals.gross.toFixed(2)} €</p></div>
            </div>
            {offerType === 'schaetzung' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700">
                Dieses Angebot wird als <strong>Schätzung</strong> gespeichert und im PDF als unverbindlich gekennzeichnet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => step > 0 ? setStep(step - 1) : router.back()}
          className="border border-gray-200 text-gray-600 text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {step === 0 ? 'Abbrechen' : 'Zurück'}
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="bg-accent hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Weiter
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="bg-accent hover:bg-accent-light disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Angebot speichern
          </button>
        )}
      </div>
    </div>
  )
}
