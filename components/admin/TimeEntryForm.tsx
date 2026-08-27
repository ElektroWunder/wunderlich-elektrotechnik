'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface Customer { id: string; name: string; company: string | null }
interface Offer { id: string; offer_number: string; title: string; customer_id: string }

interface Props {
  customers: Customer[]
  offers: Offer[]
  preselectedCustomerId?: string
  preselectedOfferId?: string
  initialData?: {
    id: string; date: string; customer_id: string | null; offer_id: string | null
    work_hours: number | null; travel_hours: number | null; description: string | null
  }
}

export default function TimeEntryForm({ customers, offers, preselectedCustomerId, preselectedOfferId, initialData }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customerId, setCustomerId] = useState(initialData?.customer_id ?? preselectedCustomerId ?? '')
  const [offerId, setOfferId] = useState(initialData?.offer_id ?? preselectedOfferId ?? '')
  const [date, setDate] = useState(initialData?.date ?? new Date().toISOString().split('T')[0])
  const [workHours, setWorkHours] = useState(String(initialData?.work_hours ?? ''))
  const [travelHours, setTravelHours] = useState(String(initialData?.travel_hours ?? ''))
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [error, setError] = useState('')

  const filteredOffers = customerId ? offers.filter(o => o.customer_id === customerId) : offers

  async function handleSave() {
    if (!date) { setError('Datum ist Pflichtfeld.'); return }
    setLoading(true); setError('')
    const supabase = createClient()

    const payload = {
      date,
      customer_id: customerId || null,
      offer_id: offerId || null,
      work_hours: parseFloat(workHours) || 0,
      travel_hours: parseFloat(travelHours) || 0,
      description: description.trim() || null,
    }

    if (initialData?.id) {
      await supabase.from('time_entries').update(payload).eq('id', initialData.id)
    } else {
      await supabase.from('time_entries').insert(payload)
    }

    router.push('/admin/zeiterfassung')
    router.refresh()
  }

  async function handleDelete() {
    if (!initialData?.id) return
    if (!confirm('Eintrag wirklich löschen?')) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('time_entries').delete().eq('id', initialData.id)
    router.push('/admin/zeiterfassung')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Datum *</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Kunde</label>
        <select value={customerId} onChange={e => { setCustomerId(e.target.value); setOfferId('') }}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors">
          <option value="">— Kein Kunde —</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ''}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Angebot / Auftrag</label>
        <select value={offerId} onChange={e => setOfferId(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors">
          <option value="">— Kein Auftrag —</option>
          {filteredOffers.map(o => <option key={o.id} value={o.id}>{o.offer_number} – {o.title}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Arbeitsstunden</label>
          <input type="number" min="0" step="0.25" value={workHours} onChange={e => setWorkHours(e.target.value)}
            placeholder="0,00"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors font-mono" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Fahrtzeit (h)</label>
          <input type="number" min="0" step="0.25" value={travelHours} onChange={e => setTravelHours(e.target.value)}
            placeholder="0,00"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors font-mono" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Tätigkeit / Notiz</label>
        <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)}
          placeholder="Was wurde gemacht?"
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors resize-none" />
      </div>

      <div className="flex items-center justify-between pt-2">
        {initialData?.id ? (
          <button type="button" onClick={handleDelete} disabled={loading}
            className="text-red-400 hover:text-red-600 text-sm transition-colors">
            Eintrag löschen
          </button>
        ) : <div />}
        <button type="button" onClick={handleSave} disabled={loading}
          className="bg-accent hover:bg-accent-light disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {initialData?.id ? 'Speichern' : 'Eintragen'}
        </button>
      </div>
    </div>
  )
}
