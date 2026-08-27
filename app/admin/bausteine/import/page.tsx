import MaterialImport from '@/components/admin/MaterialImport'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Materialien importieren – Wunderlich Admin' }

export const dynamic = 'force-dynamic'

export default function ImportPage() {
  return (
    <div className="p-8 max-w-2xl">
      <Link href="/admin/bausteine" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Zurück
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Materialien importieren</h1>
        <p className="text-gray-500 text-sm mt-1">
          CSV-Import aus Großhändler-Preislisten (Sonepar, GC-Gruppe, Rexel u.a.)
        </p>
      </div>
      <MaterialImport />
    </div>
  )
}
