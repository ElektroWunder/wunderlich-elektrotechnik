'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, Loader2 } from 'lucide-react'

interface Props {
  customerId: string
  customerName: string
}

export default function DeleteCustomerButton({ customerId, customerName }: Props) {
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('customers').delete().eq('id', customerId)
    router.push('/admin/kunden')
    router.refresh()
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Sicher?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50 flex items-center gap-1"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          Ja, löschen
        </button>
        <button onClick={() => setConfirm(false)} className="text-xs text-gray-400 hover:text-gray-600">
          Abbrechen
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
      title={`${customerName} löschen`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
