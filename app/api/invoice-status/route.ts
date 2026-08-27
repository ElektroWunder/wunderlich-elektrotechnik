import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const id = form.get('id') as string
  const status = form.get('status') as string
  const paidDate = form.get('paid_date') as string | null

  const validStatuses = ['entwurf', 'gesendet', 'bezahlt', 'mahnung']
  if (!id || !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  }

  const supabase = await createClient()
  await supabase.from('invoices').update({
    status,
    ...(paidDate ? { paid_date: paidDate } : {}),
  }).eq('id', id)

  return NextResponse.redirect(new URL(`/admin/rechnungen/${id}`, request.url))
}
