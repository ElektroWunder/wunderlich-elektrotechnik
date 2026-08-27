'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Material } from '@/lib/supabase/types'
import { Plus, Trash2, Loader2, GripVertical } from 'lucide-react'

interface BlockItem {
  id: string
  type: 'material' | 'labor' | 'text'
  description: string
  material_id: string | null
  quantity: number | null
  unit: string | null
  unit_price: number | null
  labor_hours: number | null
}

interface Props {
  materials: Material[]
  initialName?: string
  initialDescription?: string
  initialItems?: BlockItem[]
  blockId?: string
}

function newItem(): BlockItem {
  return {
    id: crypto.randomUUID(),
    type: 'material',
    description: '',
    material_id: null,
    quantity: 1,
    unit: 'Stück',
    unit_price: null,
    labor_hours: null,
  }
}

export default function BlockEditor({
  materials,
  initialName = '',
  initialDescription = '',
  initialItems = [],
  blockId,
}: Props) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [items, setItems] = useState<BlockItem[]>(initialItems.length > 0 ? initialItems : [newItem()])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addItem(type: BlockItem['type']) {
    setItems((prev) => [...prev, { ...newItem(), type }])
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateItem(id: string, field: string, value: string | number | null) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: value }
        if (field === 'material_id') {
          const mat = materials.find((m) => m.id === value)
          if (mat) {
            updated.description = mat.name
            updated.unit = mat.unit
            updated.unit_price = mat.price_per_unit
          }
        }
        return updated
      })
    )
  }

  function calcItemTotal(item: BlockItem): number {
    if (item.type === 'labor') return 0
    return (item.quantity ?? 0) * (item.unit_price ?? 0)
  }

  const totalMaterial = items
    .filter((i) => i.type === 'material')
    .reduce((s, i) => s + calcItemTotal(i), 0)

  const totalHours = items
    .filter((i) => i.type === 'labor')
    .reduce((s, i) => s + (i.labor_hours ?? 0), 0)

  async function handleSave() {
    if (!name.trim()) { setError('Bitte einen Namen eingeben.'); return }
    setError(null)
    setLoading(true)
    const supabase = createClient()

    if (blockId) {
      await supabase.from('offer_block_items').delete().eq('block_id', blockId)
      await supabase.from('offer_blocks').update({ name: name.trim(), description: description.trim() || null }).eq('id', blockId)
      const dbItems = items.map((item, idx) => ({ ...item, block_id: blockId, position: idx }))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { error } = await supabase.from('offer_block_items').insert(dbItems.map(({ id: _, ...rest }) => rest))
      if (error) { setError(error.message); setLoading(false); return }
      router.push(`/admin/bausteine/${blockId}`)
    } else {
      const { data: block, error: blockErr } = await supabase
        .from('offer_blocks')
        .insert({ name: name.trim(), description: description.trim() || null })
        .select('id')
        .single()
      if (blockErr) { setError(blockErr.message); setLoading(false); return }
      const dbItems = items.map((item, idx) => ({ ...item, block_id: block.id, position: idx }))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await supabase.from('offer_block_items').insert(dbItems.map(({ id: _, ...rest }) => rest))
      router.push(`/admin/bausteine/${block.id}`)
    }
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Name + Beschreibung */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            placeholder="z.B. Klimaanlage Split 3,5 kW Standardinstallation"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Beschreibung</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            placeholder="Kurze Beschreibung des Bausteins …"
          />
        </div>
      </div>

      {/* Positionen */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-primary text-sm">Positionen</h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addItem('material')}
              className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" /> Material
            </button>
            <button
              type="button"
              onClick={() => addItem('labor')}
              className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" /> Lohn
            </button>
            <button
              type="button"
              onClick={() => addItem('text')}
              className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" /> Text
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {items.map((item) => (
            <div key={item.id} className="p-4 flex gap-3">
              <GripVertical className="w-4 h-4 text-gray-300 shrink-0 mt-2.5 cursor-grab" />
              <div className="flex-1 space-y-3">
                {item.type === 'material' && (
                  <>
                    <div className="grid grid-cols-[1fr_auto] gap-3">
                      <select
                        value={item.material_id ?? ''}
                        onChange={(e) => updateItem(item.id, 'material_id', e.target.value || null)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50 transition-colors"
                      >
                        <option value="">— Material aus Katalog wählen —</option>
                        {materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.unit})
                          </option>
                        ))}
                      </select>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full h-fit mt-1.5">Material</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Bezeichnung</label>
                        <input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                          placeholder="Bezeichnung"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">Menge · Einheit</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.quantity ?? ''}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || null)}
                            className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                          />
                          <input
                            value={item.unit ?? ''}
                            onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                            placeholder="Stück"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">EP netto (€)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_price ?? ''}
                            onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value) || null)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono"
                          />
                          <span className="text-xs text-gray-400 shrink-0 font-mono">
                            = {calcItemTotal(item).toFixed(2)} €
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {item.type === 'labor' && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-[10px] text-gray-400 block mb-1">Bezeichnung</label>
                      <input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                        placeholder="z.B. Montage Innen- und Außengerät"
                      />
                    </div>
                    <div className="w-32">
                      <label className="text-[10px] text-gray-400 block mb-1">Stunden</label>
                      <input
                        type="number"
                        min="0"
                        step="0.25"
                        value={item.labor_hours ?? ''}
                        onChange={(e) => updateItem(item.id, 'labor_hours', parseFloat(e.target.value) || null)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none font-mono"
                        placeholder="2.5"
                      />
                    </div>
                    <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-full shrink-0 mt-4">Lohn</span>
                  </div>
                )}

                {item.type === 'text' && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-[10px] text-gray-400 block mb-1">Textposition</label>
                      <input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                        placeholder="Freitext / Hinweis"
                      />
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full shrink-0 mt-4">Text</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-gray-300 hover:text-red-400 transition-colors mt-2 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Summen-Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-500 space-x-4">
            <span>Material: <span className="text-primary font-mono font-medium">{totalMaterial.toFixed(2)} €</span></span>
            <span>Lohn: <span className="text-primary font-medium">{totalHours} h</span></span>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="bg-accent hover:bg-accent-light disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Baustein speichern
        </button>
      </div>
    </div>
  )
}
