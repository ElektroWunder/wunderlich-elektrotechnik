import { createClient } from '@/lib/supabase/server'
import OfferWizard from '@/components/admin/OfferWizard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Neues Angebot – Wunderlich Admin' }

export const dynamic = 'force-dynamic'

export default async function NeuAngebotPage({
  searchParams,
}: {
  searchParams: Promise<{ kunde?: string }>
}) {
  const { kunde } = await searchParams
  const supabase = await createClient()

  const [{ data: customers }, { data: blocks }] = await Promise.all([
    supabase.from('customers').select('id, name, company').order('name'),
    supabase
      .from('offer_blocks')
      .select('id, name, description, offer_block_items(*)')
      .order('name'),
  ])

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/angebote" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Alle Angebote
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Neues Angebot</h1>
        <p className="text-gray-500 text-sm mt-1">Schritt für Schritt ausfüllen</p>
      </div>
      <OfferWizard customers={customers ?? []} blocks={blocks ?? []} preselectedCustomerId={kunde} />
    </div>
  )
}
