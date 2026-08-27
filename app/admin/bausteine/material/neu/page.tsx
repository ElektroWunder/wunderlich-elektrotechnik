import MaterialForm from '@/components/admin/MaterialForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Material anlegen – Wunderlich Admin' }

export default function NeuMaterialPage() {
  return (
    <div className="p-8 max-w-xl">
      <Link href="/admin/bausteine" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Zurück
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Material anlegen</h1>
        <p className="text-gray-500 text-sm mt-1">Einzelner Eintrag im Materialkatalog</p>
      </div>
      <MaterialForm />
    </div>
  )
}
