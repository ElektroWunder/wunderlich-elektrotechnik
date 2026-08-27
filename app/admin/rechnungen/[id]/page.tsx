import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'

export const metadata = { title: 'Rechnung – Wunderlich Admin' }

const STATUS_LABELS: Record<string, string> = {
  entwurf: 'Entwurf', gesendet: 'Gesendet', bezahlt: 'Bezahlt', mahnung: 'Mahnung',
}
const STATUS_COLORS: Record<string, string> = {
  entwurf: 'bg-gray-100 text-gray-600',
  gesendet: 'bg-blue-100 text-blue-700',
  bezahlt: 'bg-green-100 text-green-700',
  mahnung: 'bg-red-100 text-red-600',
}

function fmt(n: number | null | undefined) {
  if (n == null) return '–'
  return n.toFixed(2).replace('.', ',') + ' €'
}

export default async function RechnungDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, customers(*), invoice_items(*), offers(offer_number, title, hourly_rate, discount_percent)')
    .eq('id', id)
    .order('position', { referencedTable: 'invoice_items' })
    .single()

  if (!invoice) notFound()

  const offer = invoice.offers as { offer_number: string; title: string; hourly_rate: number; discount_percent: number } | null
  const customer = invoice.customers as Record<string, string> | null
  const items = (invoice.invoice_items ?? []) as Array<{
    id: string; position: number; type: string; description: string
    quantity: number | null; unit: string | null; unit_price: number | null; labor_hours: number | null
  }>

  const hourlyRate = offer?.hourly_rate ?? 0
  const mat = items.filter(i => i.type === 'material').reduce((s, i) => s + (i.quantity ?? 0) * (i.unit_price ?? 0), 0)
  const laborHours = items.filter(i => i.type === 'labor').reduce((s, i) => s + (i.labor_hours ?? 0), 0)
  const labor = laborHours * hourlyRate
  const sub = mat + labor
  const discPct = offer?.discount_percent ?? 0
  const disc = sub * (discPct / 100)
  const net = sub - disc
  const vat = net * 0.19
  const gross = net + vat

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/rechnungen" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Alle Rechnungen
      </Link>

      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-primary font-mono">{invoice.invoice_number}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[invoice.status]}`}>
              {STATUS_LABELS[invoice.status]}
            </span>
          </div>
          {offer && (
            <p className="text-gray-500 text-sm">
              Aus Angebot{' '}
              <Link href={`/admin/angebote/${invoice.offer_id}`} className="text-accent hover:underline font-mono">
                {offer.offer_number}
              </Link>
              {offer.title ? ` · ${offer.title}` : ''}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <a
            href={`/api/pdf/rechnung/${invoice.id}`}
            target="_blank"
            className="border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> PDF
          </a>
          <InvoiceStatusActions invoiceId={invoice.id} currentStatus={invoice.status} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Rechnungsempfänger</p>
          {customer ? (
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-primary">{customer.name}</p>
              {customer.company && <p className="text-gray-500">{customer.company}</p>}
              {customer.street && <p className="text-gray-500">{customer.street}</p>}
              {customer.zip && <p className="text-gray-500">{customer.zip} {customer.city}</p>}
            </div>
          ) : <p className="text-gray-400 text-sm">–</p>}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Rechnungsdaten</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Rechnungsdatum</span>
              <span className="text-primary">{invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString('de-DE') : '–'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Zahlungsziel</span>
              <span className="text-primary">{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('de-DE') : '–'}</span>
            </div>
            {invoice.paid_date && (
              <div className="flex justify-between">
                <span className="text-gray-500">Bezahlt am</span>
                <span className="text-green-600 font-medium">{new Date(invoice.paid_date).toLocaleDateString('de-DE')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Positionen */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Leistungsverzeichnis</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Pos.</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Bezeichnung</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Menge</th>
              <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">Einh.</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">EP</th>
              <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-3">GP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, idx) => {
              if (item.type === 'heading') return (
                <tr key={item.id} className="bg-gray-50">
                  <td colSpan={6} className="px-6 py-3 font-semibold text-sm text-primary">{item.description}</td>
                </tr>
              )
              if (item.type === 'text') return (
                <tr key={item.id}>
                  <td className="px-6 py-3 text-gray-400 text-sm">{idx + 1}</td>
                  <td colSpan={5} className="px-6 py-3 text-sm text-gray-500 italic">{item.description}</td>
                </tr>
              )
              if (item.type === 'labor') {
                const gp = (item.labor_hours ?? 0) * hourlyRate
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 text-gray-400 text-sm">{idx + 1}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{item.description}</td>
                    <td className="px-6 py-3 text-right text-sm font-mono">{item.labor_hours}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">Std.</td>
                    <td className="px-6 py-3 text-right text-sm font-mono text-gray-500">{fmt(hourlyRate)}</td>
                    <td className="px-6 py-3 text-right text-sm font-mono font-medium text-primary">{fmt(gp)}</td>
                  </tr>
                )
              }
              const gp = (item.quantity ?? 0) * (item.unit_price ?? 0)
              return (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-3 text-gray-400 text-sm">{idx + 1}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{item.description}</td>
                  <td className="px-6 py-3 text-right text-sm font-mono">{item.quantity}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{item.unit}</td>
                  <td className="px-6 py-3 text-right text-sm font-mono text-gray-500">{fmt(item.unit_price)}</td>
                  <td className="px-6 py-3 text-right text-sm font-mono font-medium text-primary">{fmt(gp)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Summen */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 ml-auto max-w-xs">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-500"><span>Material netto</span><span className="font-mono">{fmt(mat)}</span></div>
          <div className="flex justify-between text-gray-500"><span>Lohn netto ({laborHours.toFixed(2)} h)</span><span className="font-mono">{fmt(labor)}</span></div>
          {disc > 0 && <div className="flex justify-between text-red-500"><span>Rabatt {discPct}%</span><span className="font-mono">−{fmt(disc)}</span></div>}
          <div className="flex justify-between text-gray-500"><span>Netto gesamt</span><span className="font-mono">{fmt(net)}</span></div>
          <div className="flex justify-between text-gray-500"><span>MwSt. 19%</span><span className="font-mono">{fmt(vat)}</span></div>
          <div className="flex justify-between font-bold text-primary border-t border-gray-200 pt-2 mt-1 text-base">
            <span>Gesamt brutto</span><span className="font-mono">{fmt(gross)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function InvoiceStatusActions({ invoiceId, currentStatus }: { invoiceId: string; currentStatus: string }) {
  const transitions: Record<string, { label: string; next: string; color: string }[]> = {
    entwurf: [{ label: 'Als gesendet markieren', next: 'gesendet', color: 'border-blue-200 text-blue-700 hover:bg-blue-50' }],
    gesendet: [
      { label: 'Als bezahlt markieren', next: 'bezahlt', color: 'border-green-200 text-green-700 hover:bg-green-50' },
      { label: 'Mahnung', next: 'mahnung', color: 'border-red-200 text-red-600 hover:bg-red-50' },
    ],
    mahnung: [{ label: 'Als bezahlt markieren', next: 'bezahlt', color: 'border-green-200 text-green-700 hover:bg-green-50' }],
    bezahlt: [],
  }

  const options = transitions[currentStatus] ?? []

  return (
    <>
      {options.map((opt) => (
        <form key={opt.next} action="/api/invoice-status" method="post">
          <input type="hidden" name="id" value={invoiceId} />
          <input type="hidden" name="status" value={opt.next} />
          {opt.next === 'bezahlt' && <input type="hidden" name="paid_date" value={new Date().toISOString().split('T')[0]} />}
          <button type="submit" className={`border text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors ${opt.color}`}>
            {opt.label}
          </button>
        </form>
      ))}
    </>
  )
}
