import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CustomerForm from '@/components/admin/CustomerForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function KundeBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: customer } = await supabase.from('customers').select('*').eq('id', id).single()
  if (!customer) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <Link
        href={`/admin/kunden/${id}`}
        className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Zurück
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Kunde bearbeiten</h1>
        <p className="text-gray-500 text-sm mt-1">{customer.name}</p>
      </div>
      <CustomerForm customer={customer} />
    </div>
  )
}
