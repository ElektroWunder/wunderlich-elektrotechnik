import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, Building, FileText, Plus, Pencil } from 'lucide-react'
import DeleteCustomerButton from '@/components/admin/DeleteCustomerButton'

export const dynamic = 'force-dynamic'

export default async function KundeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: customer }, { data: offers }] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).single(),
    supabase
      .from('offers')
      .select('id, offer_number, title, type, status, created_at')
      .eq('customer_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!customer) notFound()

  const statusColors: Record<string, string> = {
    entwurf: 'bg-gray-100 text-gray-600',
    gesendet: 'bg-blue-100 text-blue-700',
    angenommen: 'bg-green-100 text-green-700',
    abgelehnt: 'bg-red-100 text-red-600',
  }

  const typeLabels: Record<string, string> = {
    schaetzung: 'Schätzung',
    kva: 'Kostenvoranschlag',
    festpreis: 'Festpreis',
  }

  return (
    <div className="p-8">
      <Link
        href="/admin/kunden"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Alle Kunden
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Linke Spalte: Angebote */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-primary">{customer.name}</h1>
                {customer.company && (
                  <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" /> {customer.company}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/kunden/${id}/bearbeiten`}
                  className="text-gray-400 hover:text-primary p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Bearbeiten"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <DeleteCustomerButton customerId={id} customerName={customer.name} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {(customer.street || customer.city) && (
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                  <span>{[customer.street, [customer.zip, customer.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {customer.phone && (
                <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-gray-600 hover:text-accent transition-colors">
                  <Phone className="w-4 h-4 shrink-0 text-gray-400" />
                  {customer.phone}
                </a>
              )}
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-gray-600 hover:text-accent transition-colors">
                  <Mail className="w-4 h-4 shrink-0 text-gray-400" />
                  {customer.email}
                </a>
              )}
            </div>

            {customer.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Notizen</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{customer.notes}</p>
              </div>
            )}
          </div>

          {/* Angebote */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-primary">Angebote</h2>
              <Link
                href={`/admin/angebote/neu?kunde=${id}`}
                className="bg-accent hover:bg-accent-light text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Neues Angebot
              </Link>
            </div>
            {offers && offers.length > 0 ? (
              <div className="space-y-2">
                {offers.map((offer) => (
                  <Link
                    key={offer.id}
                    href={`/admin/angebote/${offer.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-accent/30 hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-primary">{offer.offer_number}</p>
                        <p className="text-xs text-gray-400">{offer.title} · {typeLabels[offer.type]}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${statusColors[offer.status]}`}>
                      {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">Noch keine Angebote für diesen Kunden</p>
            )}
          </div>
        </div>

        {/* Rechte Spalte: Meta */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-fit">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Details</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Angelegt</span>
              <span className="text-primary">{new Date(customer.created_at).toLocaleDateString('de-DE')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Angebote</span>
              <span className="text-primary">{offers?.length ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
