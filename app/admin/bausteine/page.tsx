import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Wrench, Package } from 'lucide-react'

export const metadata = { title: 'Bausteine – Wunderlich Admin' }

export default async function BausteinePage() {
  const supabase = await createClient()

  const [{ data: blocks }, { data: materials }] = await Promise.all([
    supabase
      .from('offer_blocks')
      .select('id, name, description, created_at, offer_block_items(id)')
      .order('name'),
    supabase
      .from('materials')
      .select('id, name, unit, price_per_unit, category')
      .order('category, name'),
  ])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">Bausteine</h1>
          <p className="text-gray-500 text-sm mt-1">Angebotsvorlagen und Materialkatalog</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/bausteine/import"
            className="border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Package className="w-4 h-4" /> CSV-Import
          </Link>
          <Link
            href="/admin/bausteine/material/neu"
            className="border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Package className="w-4 h-4" /> Material anlegen
          </Link>
          <Link
            href="/admin/bausteine/neu"
            className="bg-accent hover:bg-accent-light text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Neuer Baustein
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bausteine */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Wrench className="w-4 h-4" /> Bausteine ({blocks?.length ?? 0})
          </h2>
          <div className="space-y-3">
            {blocks && blocks.length > 0 ? blocks.map((block) => (
              <Link
                key={block.id}
                href={`/admin/bausteine/${block.id}`}
                className="block bg-white rounded-xl border border-gray-100 p-4 hover:border-accent/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-primary text-sm">{block.name}</p>
                    {block.description && (
                      <p className="text-gray-500 text-xs mt-0.5">{block.description}</p>
                    )}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full shrink-0 ml-3">
                    {(block.offer_block_items as { id: string }[] | null)?.length ?? 0} Positionen
                  </span>
                </div>
              </Link>
            )) : (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <p className="text-gray-400 text-sm">Noch keine Bausteine</p>
                <Link href="/admin/bausteine/neu" className="text-accent text-sm hover:underline mt-1 inline-block">
                  Ersten Baustein erstellen →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Materialkatalog */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" /> Materialkatalog ({materials?.length ?? 0})
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {materials && materials.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Material</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Einheit</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">EP netto</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {materials.map((mat) => (
                    <tr key={mat.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-primary">{mat.name}</p>
                        {mat.category && <p className="text-xs text-gray-400">{mat.category}</p>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{mat.unit}</td>
                      <td className="px-4 py-3 text-sm text-primary text-right font-mono">
                        {mat.price_per_unit.toFixed(2)} €
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/bausteine/material/${mat.id}`} className="text-xs text-accent hover:underline">
                          Bearb.
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-400 text-sm">Noch keine Materialien</p>
                <Link href="/admin/bausteine/material/neu" className="text-accent text-sm hover:underline mt-1 inline-block">
                  Erstes Material anlegen →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
