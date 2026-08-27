'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Customer } from '@/lib/supabase/types'
import { Loader2 } from 'lucide-react'

interface Props {
  customer?: Customer
}

export default function CustomerForm({ customer }: Props) {
  const router = useRouter()
  const isEdit = !!customer

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: customer?.name ?? '',
    company: customer?.company ?? '',
    street: customer?.street ?? '',
    zip: customer?.zip ?? '',
    city: customer?.city ?? '',
    phone: customer?.phone ?? '',
    email: customer?.email ?? '',
    notes: customer?.notes ?? '',
  })

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const payload = {
      name: form.name.trim(),
      company: form.company.trim() || null,
      street: form.street.trim() || null,
      zip: form.zip.trim() || null,
      city: form.city.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      notes: form.notes.trim() || null,
    }

    if (isEdit) {
      const { error } = await supabase.from('customers').update(payload).eq('id', customer!.id)
      if (error) { setError(error.message); setLoading(false); return }
      router.push(`/admin/kunden/${customer!.id}`)
    } else {
      const { data, error } = await supabase.from('customers').insert(payload).select('id').single()
      if (error) { setError(error.message); setLoading(false); return }
      router.push(`/admin/kunden/${data.id}`)
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Name *
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            placeholder="Max Mustermann"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Firma
          </label>
          <input
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            placeholder="Musterfirma GmbH"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Straße
          </label>
          <input
            value={form.street}
            onChange={(e) => set('street', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            placeholder="Musterstraße 1"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            PLZ
          </label>
          <input
            value={form.zip}
            onChange={(e) => set('zip', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            placeholder="58452"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Ort
          </label>
          <input
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            placeholder="Witten"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Telefon
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            placeholder="0152 00000000"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            E-Mail
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
            placeholder="max@example.de"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Notizen
          </label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors resize-none"
            placeholder="Interne Notizen zum Kunden …"
          />
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-200 text-gray-600 text-sm px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-accent hover:bg-accent-light disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isEdit ? 'Speichern' : 'Kunde anlegen'}
        </button>
      </div>
    </form>
  )
}
