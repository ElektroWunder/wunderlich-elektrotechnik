import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BlockEditor from '@/components/admin/BlockEditor'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BausteinDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: block }, { data: materials }] = await Promise.all([
    supabase
      .from('offer_blocks')
      .select('*, offer_block_items(*)')
      .eq('id', id)
      .single(),
    supabase.from('materials').select('id, name, unit, price_per_unit, category, created_at').order('name'),
  ])

  if (!block) notFound()

  const items = (block.offer_block_items ?? [])
    .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
    .map((item: Record<string, unknown>) => ({
      ...item,
      id: item.id as string,
    }))

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/bausteine" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Alle Bausteine
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">{block.name}</h1>
        {block.description && <p className="text-gray-500 text-sm mt-1">{block.description}</p>}
      </div>
      <BlockEditor
        materials={materials ?? []}
        initialName={block.name}
        initialDescription={block.description ?? ''}
        initialItems={items}
        blockId={id}
      />
    </div>
  )
}
