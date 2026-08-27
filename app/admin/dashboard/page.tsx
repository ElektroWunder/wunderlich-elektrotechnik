import { createClient } from '@/lib/supabase/server'
import { Users, FileText, Receipt, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Dashboard – Wunderlich Admin' }

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: customerCount },
    { count: offerCount },
    { count: invoiceCount },
    { data: recentOffers },
    { data: openInvoices },
  ] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('offers').select('*', { count: 'exact', head: true }),
    supabase.from('invoices').select('*', { count: 'exact', head: true }),
    supabase
      .from('offers')
      .select('id, offer_number, title, status, created_at, customers(name)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('invoices')
      .select('id, invoice_number, status, due_date, customers(name)')
      .in('status', ['gesendet', 'mahnung'])
      .order('due_date', { ascending: true })
      .limit(5),
  ])

  const stats = [
    { label: 'Kunden', value: customerCount ?? 0, icon: Users, href: '/admin/kunden', color: 'text-blue-600 bg-blue-50' },
    { label: 'Angebote', value: offerCount ?? 0, icon: FileText, href: '/admin/angebote', color: 'text-amber-600 bg-amber-50' },
    { label: 'Rechnungen', value: invoiceCount ?? 0, icon: Receipt, href: '/admin/rechnungen', color: 'text-green-600 bg-green-50' },
    { label: 'Offen', value: openInvoices?.length ?? 0, icon: TrendingUp, href: '/admin/rechnungen', color: 'text-red-600 bg-red-50' },
  ]

  const statusColors: Record<string, string> = {
    entwurf: 'bg-gray-100 text-gray-600',
    gesendet: 'bg-blue-100 text-blue-700',
    angenommen: 'bg-green-100 text-green-700',
    abgelehnt: 'bg-red-100 text-red-600',
    bezahlt: 'bg-green-100 text-green-700',
    mahnung: 'bg-orange-100 text-orange-700',
  }

  const statusLabels: Record<string, string> = {
    entwurf: 'Entwurf',
    gesendet: 'Gesendet',
    angenommen: 'Angenommen',
    abgelehnt: 'Abgelehnt',
    bezahlt: 'Bezahlt',
    mahnung: 'Mahnung',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Übersicht Wunderlich Elektrotechnik</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-primary">{value}</p>
            <p className="text-gray-500 text-sm">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Letzte Angebote */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-primary">Letzte Angebote</h2>
            <Link href="/admin/angebote" className="text-accent text-sm hover:underline">Alle →</Link>
          </div>
          {recentOffers && recentOffers.length > 0 ? (
            <div className="space-y-3">
              {recentOffers.map((offer) => (
                <Link
                  key={offer.id}
                  href={`/admin/angebote/${offer.id}`}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-primary">{offer.offer_number}</p>
                    <p className="text-xs text-gray-400">
                      {(offer.customers as unknown as { name: string } | null)?.name} · {offer.title}
                    </p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${statusColors[offer.status]}`}>
                    {statusLabels[offer.status]}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">Noch keine Angebote</p>
              <Link href="/admin/angebote/neu" className="text-accent text-sm hover:underline mt-1 inline-block">
                Erstes Angebot erstellen →
              </Link>
            </div>
          )}
        </div>

        {/* Offene Rechnungen */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-primary">Offene Rechnungen</h2>
            <Link href="/admin/rechnungen" className="text-accent text-sm hover:underline">Alle →</Link>
          </div>
          {openInvoices && openInvoices.length > 0 ? (
            <div className="space-y-3">
              {openInvoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/admin/rechnungen/${inv.id}`}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-primary">{inv.invoice_number}</p>
                    <p className="text-xs text-gray-400">
                      {(inv.customers as unknown as { name: string } | null)?.name}
                      {inv.due_date ? ` · Fällig ${new Date(inv.due_date).toLocaleDateString('de-DE')}` : ''}
                    </p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${statusColors[inv.status]}`}>
                    {statusLabels[inv.status]}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">Keine offenen Rechnungen</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/kunden/neu"
          className="bg-white border border-gray-200 text-sm text-primary px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          + Neuer Kunde
        </Link>
        <Link
          href="/admin/angebote/neu"
          className="bg-accent text-white text-sm px-4 py-2.5 rounded-lg hover:bg-accent-light transition-colors font-medium"
        >
          + Neues Angebot
        </Link>
      </div>
    </div>
  )
}
