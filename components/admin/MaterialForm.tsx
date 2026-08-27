'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Material } from '@/lib/supabase/types'
import { Loader2 } from 'lucide-react'

const UNITS = ['Stück', 'm', 'm²', 'm³', 'kg', 'Liter', 'Satz', 'Paar', 'Rolle', 'Bund', 'Paket', 'h']
const CATEGORIES = ['Kabel & Leitungen', 'Schaltmaterial', 'Gehäuse & Schränke', 'Klimatechnik', 'Kältetechnik', 'Photovoltaik', 'E-Mobilität', 'Befestigung', 'Sonstiges']

interface Props {
  material?: Material
}

export default function MaterialForm({ material }: Props) {
  const router = useRouter()
  const isEdit = !!material
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: material?.name ?? '',
    unit: material?.unit ?? 'Stück',
    price_per_unit: material?.price_per_unit?.toString() ?? '',
    category: material?.category ?? '',
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()

    const payload = {
      name: form.name.trim(),
      unit: form.unit,
      price_per_unit: parseFloat(form.price_per_unit) || 0,
      category: form.category || null,
    }

    if (isEdit) {
      const { error } = await supabase.from('materials').update(payload).eq('id', material!.id)
      if (error) { setError(error.message); setLoading(false); return }
    } else {
      const { error } = await supabase.from('materials').insert(payload)
      if (error) { setError(error.message); setLoading(false); return }
    }
    router.push('/admin/bausteine')
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm(`"${material?.name}" wirklich löschen?`)) return
    const supabase = createClient()
    await supabase.from('materials').delete().eq('id', material!.id)
    router.push('/admin/bausteine')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bezeichnung *</label>
        <input
          required
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
          placeholder="NYM-J 3×1,5 mm²"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Einheit</label>
          <select
            value={form.unit}
            onChange={(e) => set('unit', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
          >
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">EP netto (€)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price_per_unit}
            onChange={(e) => set('price_per_unit', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors font-mono"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Kategorie</label>
        <select
          value={form.category}
          onChange={(e) => set('category', e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
        >
          <option value="">— Keine Kategorie —</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => router.back()} className="border border-gray-200 text-gray-600 text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
          Abbrechen
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className="border border-red-200 text-red-500 text-sm px-4 py-2.5 rounded-lg hover:bg-red-50 transition-colors ml-auto">
            Löschen
          </button>
        )}
        <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-light disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isEdit ? 'Speichern' : 'Material anlegen'}
        </button>
      </div>
    </form>
  )
}
