import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TimeEntryForm from '@/components/admin/TimeEntryForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function EditZeitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: entry }, { data: customers }, { data: offers }] = await Promise.all([
    supabase.from('time_entries').select('*').eq('id', id).single(),
    supabase.from('customers').select('id, name, company').order('name'),
    supabase.from('offers').select('id, offer_number, title, customer_id').order('created_at', { ascending: false }).limit(50),
  ])

  if (!entry) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/admin/zeiterfassung" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Zeiterfassung
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Zeit bearbeiten</h1>
        <p className="text-gray-500 text-sm mt-1">{new Date(entry.date).toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
      </div>
      <TimeEntryForm
        customers={customers ?? []}
        offers={offers ?? []}
        initialData={entry}
      />
    </div>
  )
}
