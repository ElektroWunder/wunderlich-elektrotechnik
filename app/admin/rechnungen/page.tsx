import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FileText } from 'lucide-react'

export const metadata = { title: 'Rechnungen – Wunderlich Admin' }

const STATUS_LABELS: Record<string, string> = {
  entwurf: 'Entwurf', gesendet: 'Gesendet', bezahlt: 'Bezahlt', mahnung: 'Mahnung',
}
const STATUS_COLORS: Record<string, string> = {
  entwurf: 'bg-gray-100 text-gray-600',
  gesendet: 'bg-blue-100 text-blue-700',
  bezahlt: 'bg-green-100 text-green-700',
  mahnung: 'bg-red-100 text-red-600',
}

export default async function RechnungenPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('invoices')
    .select('id, invoice_number, status, issue_date, due_date, paid_date, customers(name)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data: invoices } = await query

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Rechnungen</h1>
          <p className="text-gray-500 text-sm mt-1">{invoices?.length ?? 0} Einträge</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'entwurf', 'gesendet', 'bezahlt', 'mahnung'].map((s) => (
          <Link
            key={s}
            href={s ? `/admin/rechnungen?status=${s}` : '/admin/rechnungen'}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              status === s || (!status && s === '')
                ? 'bg-primary text-white border-primary'
                : 'border-gray-200 text-gray-600 hover:border-primary/30'
            }`}
          >
            {s ? STATUS_LABELS[s] : 'Alle'}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {invoices && invoices.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Nummer</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Kunde</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Fällig</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="font-mono text-sm font-medium text-primary">{inv.invoice_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                    {(inv.customers as unknown as { name: string } | null)?.name ?? '–'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                    {inv.due_date ? new Date(inv.due_date).toLocaleDateString('de-DE') : '–'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${STATUS_COLORS[inv.status]}`}>
                      {STATUS_LABELS[inv.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/rechnungen/${inv.id}`} className="text-accent text-sm hover:underline">
                      Öffnen →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Keine Rechnungen gefunden</p>
            <p className="text-gray-400 text-xs mt-1">Rechnungen werden aus angenommenen Angeboten erstellt.</p>
            <Link href="/admin/angebote" className="text-accent text-sm hover:underline mt-2 inline-block">
              Zu den Angeboten →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
