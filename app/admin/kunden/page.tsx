import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Search, User } from 'lucide-react'

export const metadata = { title: 'Kunden – Wunderlich Admin' }

export default async function KundenPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('customers')
    .select('id, name, company, city, phone, email, created_at')
    .order('name', { ascending: true })

  if (q) {
    query = query.or(`name.ilike.%${q}%,company.ilike.%${q}%,city.ilike.%${q}%`)
  }

  const { data: customers } = await query

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Kunden</h1>
          <p className="text-gray-500 text-sm mt-1">{customers?.length ?? 0} Einträge</p>
        </div>
        <Link
          href="/admin/kunden/neu"
          className="bg-accent hover:bg-accent-light text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Neuer Kunde
        </Link>
      </div>

      {/* Suche */}
      <form className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            name="q"
            defaultValue={q}
            type="search"
            placeholder="Name, Firma, Ort …"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
      </form>

      {/* Tabelle */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {customers && customers.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Firma</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Ort</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Kontakt</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-medium text-primary text-sm">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                    {customer.company ?? '–'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                    {customer.city ?? '–'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                    {customer.phone ?? customer.email ?? '–'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/kunden/${customer.id}`}
                      className="text-accent text-sm hover:underline"
                    >
                      Öffnen →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16">
            <User className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {q ? `Keine Kunden für "${q}"` : 'Noch keine Kunden angelegt'}
            </p>
            {!q && (
              <Link href="/admin/kunden/neu" className="text-accent text-sm hover:underline mt-2 inline-block">
                Ersten Kunden anlegen →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
