import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, Download, Copy, Check, X } from 'lucide-react'

export const metadata = { title: 'Angebot – Wunderlich Admin' }

const TYPE_LABELS: Record<string, string> = {
  schaetzung: 'Schätzung', kva: 'Kostenvoranschlag', festpreis: 'Festpreis',
}
const TYPE_COLORS: Record<string, string> = {
  schaetzung: 'bg-amber-100 text-amber-700 border-amber-200',
  kva: 'bg-blue-100 text-blue-700 border-blue-200',
  festpreis: 'bg-green-100 text-green-700 border-green-200',
}
const STATUS_LABELS: Record<string, string> = {
  entwurf: 'Entwurf', gesendet: 'Gesendet', angenommen: 'Angenommen', abgelehnt: 'Abgelehnt',
}
const STATUS_COLORS: Record<string, string> = {
  entwurf: 'bg-gray-100 text-gray-600',
  gesendet: 'bg-blue-100 text-blue-700',
  angenommen: 'bg-green-100 text-green-700',
  abgelehnt: 'bg-red-100 text-red-600',
}

function fmt(n: number | null | undefined) {
  if (n == null) return '–'
  return n.toFixed(2).replace('.', ',') + ' €'
}

export default async function AngebotsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: offer } = await supabase
    .from('offers')
    .select('*, customers(*), offer_items(*)')
    .eq('id', id)
    .order('position', { referencedTable: 'offer_items' })
    .single()

  if (!offer) notFound()

  const customer = offer.customers as Record<string, string> | null
  const items = (offer.offer_items ?? []) as Array<{
    id: string; position: number; type: string; description: string
    quantity: number | null; unit: string | null; unit_price: number | null; labor_hours: number | null
  }>

  const mat = items.filter(i => i.type === 'material').reduce((s, i) => s + (i.quantity ?? 0) * (i.unit_price ?? 0), 0)
  const laborHours = items.filter(i => i.type === 'labor').reduce((s, i) => s + (i.labor_hours ?? 0), 0)
  const labor = laborHours * (offer.hourly_rate ?? 0)
  const sub = mat + labor
  const disc = sub * ((offer.discount_percent ?? 0) / 100)
  const net = sub - disc
  const vat = net * 0.19
  const gross = net + vat

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/angebote" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Alle Angebote
      </Link>

      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-primary font-mono">{offer.offer_number}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${TYPE_COLORS[offer.type]}`}>
              {TYPE_LABELS[offer.type]}
            </span>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[offer.status]}`}>
              {STATUS_LABELS[offer.status]}
            </span>
          </div>
          <p className="text-gray-600">{offer.title}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={`/api/pdf/angebot/${offer.id}`}
            target="_blank"
            className="border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> PDF
          </a>
          <OfferStatusActions offerId={offer.id} currentStatus={offer.status} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {/* Kunde */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Kunde</p>
          {customer ? (
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-primary">{customer.name}</p>
              {customer.company && <p className="text-gray-500">{customer.company}</p>}
              {customer.street && <p className="text-gray-500">{customer.street}</p>}
              {customer.zip && <p className="text-gray-500">{customer.zip} {customer.city}</p>}
              {customer.phone && <p className="text-gray-500">{customer.phone}</p>}
              {customer.email && <p className="text-gray-500">{customer.email}</p>}
              <Link href={`/admin/kunden/${offer.customer_id}`} className="text-accent text-xs hover:underline pt-1 inline-block">
                Kundenprofil →
              </Link>
            </div>
          ) : <p className="text-gray-400 text-sm">–</p>}
        </div>

        {/* Angebotsinfos */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Details</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Erstellt</span>
              <span className="text-primary">{new Date(offer.created_at).toLocaleDateString('de-DE')}</span>
            </div>
            {offer.inspection_date && (
              <div className="flex justify-between">
                <span className="text-gray-500">Besichtigung</span>
                <span className="text-primary">{new Date(offer.inspection_date).toLocaleDateString('de-DE')}</span>
              </div>
            )}
            {offer.valid_until && (
              <div className="flex justify-between">
                <span className="text-gray-500">Gültig bis</span>
                <span className="text-primary">{new Date(offer.valid_until).toLocaleDateString('de-DE')}</span>
              </div>
            )}
            {offer.hourly_rate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Stundensatz</span>
                <span className="font-mono text-primary">{Number(offer.hourly_rate).toFixed(2)} €</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Positionstabelle */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Positionen</p>
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
                const lp = (item.labor_hours ?? 0) * (offer.hourly_rate ?? 0)
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 text-gray-400 text-sm">{idx + 1}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{item.description}</td>
                    <td className="px-6 py-3 text-right text-sm font-mono">{item.labor_hours}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">Std.</td>
                    <td className="px-6 py-3 text-right text-sm font-mono text-gray-500">{fmt(offer.hourly_rate)}</td>
                    <td className="px-6 py-3 text-right text-sm font-mono font-medium text-primary">{fmt(lp)}</td>
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
          {disc > 0 && <div className="flex justify-between text-red-500"><span>Rabatt {offer.discount_percent}%</span><span className="font-mono">−{fmt(disc)}</span></div>}
          <div className="flex justify-between text-gray-500"><span>Netto gesamt</span><span className="font-mono">{fmt(net)}</span></div>
          <div className="flex justify-between text-gray-500"><span>MwSt. 19%</span><span className="font-mono">{fmt(vat)}</span></div>
          <div className="flex justify-between font-bold text-primary border-t border-gray-200 pt-2 mt-1 text-base">
            <span>Gesamt brutto</span><span className="font-mono">{fmt(gross)}</span>
          </div>
        </div>
      </div>

      {/* Notizen */}
      {offer.notes && (
        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">Interne Notizen</p>
          <p className="text-sm text-amber-800">{offer.notes}</p>
        </div>
      )}

      {/* Rechnung erstellen */}
      <div className="mt-8 border-t border-gray-100 pt-6">
        {offer.status === 'angenommen' ? (
          <Link
            href={`/admin/rechnungen/neu?angebot=${offer.id}`}
            className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <FileText className="w-4 h-4" /> Rechnung erstellen
          </Link>
        ) : (
          <p className="text-sm text-gray-400">Angebot als &quot;Angenommen&quot; markieren, um eine Rechnung zu erstellen.</p>
        )}
      </div>
    </div>
  )
}

function OfferStatusActions({ offerId, currentStatus }: { offerId: string; currentStatus: string }) {
  const next = currentStatus === 'entwurf' ? 'gesendet'
    : currentStatus === 'gesendet' ? null
    : null

  return (
    <div className="flex gap-2">
      {currentStatus === 'gesendet' && (
        <>
          <form action={`/api/offer-status`} method="post">
            <input type="hidden" name="id" value={offerId} />
            <input type="hidden" name="status" value="angenommen" />
            <button type="submit" className="border border-green-200 text-green-700 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-50 transition-colors">
              <Check className="w-4 h-4" /> Angenommen
            </button>
          </form>
          <form action={`/api/offer-status`} method="post">
            <input type="hidden" name="id" value={offerId} />
            <input type="hidden" name="status" value="abgelehnt" />
            <button type="submit" className="border border-red-200 text-red-600 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-red-50 transition-colors">
              <X className="w-4 h-4" /> Abgelehnt
            </button>
          </form>
        </>
      )}
      {next && (
        <form action={`/api/offer-status`} method="post">
          <input type="hidden" name="id" value={offerId} />
          <input type="hidden" name="status" value={next} />
          <button type="submit" className="border border-blue-200 text-blue-700 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-50 transition-colors">
            <Copy className="w-4 h-4" /> Als gesendet markieren
          </button>
        </form>
      )}
    </div>
  )
}
