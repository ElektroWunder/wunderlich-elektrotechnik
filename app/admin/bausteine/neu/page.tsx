import { createClient } from '@/lib/supabase/server'
import BlockEditor from '@/components/admin/BlockEditor'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Neuer Baustein – Wunderlich Admin' }

export const dynamic = 'force-dynamic'

export default async function NeuBausteinPage() {
  const supabase = await createClient()
  const { data: materials } = await supabase
    .from('materials')
    .select('id, name, unit, price_per_unit, category, created_at')
    .order('name')

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/bausteine" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Alle Bausteine
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Neuer Baustein</h1>
        <p className="text-gray-500 text-sm mt-1">Vorlage aus Material- und Lohnpositionen zusammenstellen</p>
      </div>
      <BlockEditor materials={materials ?? []} />
    </div>
  )
}
