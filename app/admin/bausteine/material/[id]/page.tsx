import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import MaterialForm from '@/components/admin/MaterialForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function MaterialBearbeitenPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: material } = await supabase.from('materials').select('*').eq('id', id).single()
  if (!material) notFound()

  return (
    <div className="p-8 max-w-xl">
      <Link href="/admin/bausteine" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Zurück
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Material bearbeiten</h1>
      </div>
      <MaterialForm material={material} />
    </div>
  )
}
