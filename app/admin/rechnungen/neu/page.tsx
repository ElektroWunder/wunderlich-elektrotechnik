import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Rechnung erstellen – Wunderlich Admin' }

export const dynamic = 'force-dynamic'

export default async function NeuRechnungPage({
  searchParams,
}: {
  searchParams: Promise<{ angebot?: string }>
}) {
  const { angebot: offerId } = await searchParams

  if (!offerId) redirect('/admin/angebote')

  const supabase = await createClient()

  const { data: offer } = await supabase
    .from('offers')
    .select('*, customers(*), offer_items(*)')
    .eq('id', offerId)
    .order('position', { referencedTable: 'offer_items' })
    .single()

  if (!offer || offer.status !== 'angenommen') redirect('/admin/angebote')

  // Check if invoice already exists for this offer
  const { data: existingInvoice } = await supabase
    .from('invoices')
    .select('id')
    .eq('offer_id', offerId)
    .maybeSingle()

  if (existingInvoice) redirect(`/admin/rechnungen/${existingInvoice.id}`)

  // Create invoice from offer (snapshot items)
  const issueDate = new Date().toISOString().split('T')[0]
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      offer_id: offerId,
      customer_id: offer.customer_id,
      status: 'entwurf',
      issue_date: issueDate,
      due_date: dueDate,
    })
    .select('id')
    .single()

  if (error || !invoice) {
    return (
      <div className="p-8">
        <Link href={`/admin/angebote/${offerId}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Zurück
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-700 text-sm">
          Fehler beim Erstellen der Rechnung. Bitte erneut versuchen.
        </div>
      </div>
    )
  }

  // Copy offer items as invoice items (snapshot)
  const items = (offer.offer_items ?? []).map((item: Record<string, unknown>) => ({
    invoice_id: invoice.id,
    position: item.position,
    type: item.type,
    description: item.description,
    quantity: item.quantity,
    unit: item.unit,
    unit_price: item.unit_price,
    labor_hours: item.labor_hours,
  }))

  if (items.length > 0) {
    await supabase.from('invoice_items').insert(items)
  }

  redirect(`/admin/rechnungen/${invoice.id}`)
}
