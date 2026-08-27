import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Clock, TrendingUp } from 'lucide-react'

export const metadata = { title: 'Zeiterfassung – Wunderlich Admin' }

function startOfWeek(d: Date) {
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

export default async function ZeiterfassungPage({
  searchParams,
}: {
  searchParams: Promise<{ von?: string; bis?: string; kunde?: string }>
}) {
  const { von, bis, kunde } = await searchParams
  const supabase = await createClient()

  const today = new Date()
  const weekStart = startOfWeek(new Date())
  const defaultVon = weekStart.toISOString().split('T')[0]
  const defaultBis = today.toISOString().split('T')[0]

  const vonDate = von ?? defaultVon
  const bisDate = bis ?? defaultBis

  await supabase.auth.getUser()

  let query = supabase
    .from('time_entries')
    .select('*, customers(name), offers(offer_number, title)')
    .gte('date', vonDate)
    .lte('date', bisDate)
    .order('date', { ascending: false })

  if (kunde) query = query.eq('customer_id', kunde)

  const { data: entries } = await query
  const { data: customers } = await supabase.from('customers').select('id, name').order('name')

  const totalWork = entries?.reduce((s, e) => s + (e.work_hours ?? 0), 0) ?? 0
  const totalTravel = entries?.reduce((s, e) => s + (e.travel_hours ?? 0), 0) ?? 0

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Zeiterfassung</h1>
          <p className="text-gray-500 text-sm mt-1">Arbeits- und Fahrtzeiten pro Auftrag</p>
        </div>
        <Link
          href="/admin/zeiterfassung/neu"
          className="bg-accent hover:bg-accent-light text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Zeit eintragen
        </Link>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <form className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Von</label>
            <input type="date" name="von" defaultValue={vonDate}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Bis</label>
            <input type="date" name="bis" defaultValue={bisDate}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Kunde</label>
            <select name="kunde" defaultValue={kunde ?? ''}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent/50">
              <option value="">Alle</option>
              {customers?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Filtern
          </button>
        </form>
      </div>

      {/* Zusammenfassung */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Arbeitsstunden</p>
              <p className="text-xl font-bold text-primary">{totalWork.toFixed(2)} h</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Fahrtzeit</p>
              <p className="text-xl font-bold text-primary">{totalTravel.toFixed(2)} h</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Gesamt</p>
              <p className="text-xl font-bold text-primary">{(totalWork + totalTravel).toFixed(2)} h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Einträge */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {entries && entries.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Datum</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Kunde / Auftrag</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Tätigkeit</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Arbeit</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Fahrt</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {entries.map((entry) => {
                const customer = entry.customers as { name: string } | null
                const offer = entry.offers as { offer_number: string; title: string } | null
                return (
                  <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-primary font-medium">
                      {new Date(entry.date).toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-700">{customer?.name ?? '–'}</p>
                      {offer && <p className="text-xs text-gray-400 font-mono">{offer.offer_number}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell max-w-xs truncate">
                      {entry.description ?? '–'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-mono font-bold text-primary">
                      {(entry.work_hours ?? 0).toFixed(2)} h
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-mono text-gray-500 hidden sm:table-cell">
                      {(entry.travel_hours ?? 0).toFixed(2)} h
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/zeiterfassung/${entry.id}`} className="text-accent text-sm hover:underline">
                        Bearbeiten
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16">
            <Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Keine Einträge für diesen Zeitraum</p>
            <Link href="/admin/zeiterfassung/neu" className="text-accent text-sm hover:underline mt-2 inline-block">
              Zeit eintragen →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
