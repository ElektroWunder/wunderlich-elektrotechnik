import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const id = form.get('id') as string
  const status = form.get('status') as string

  const validStatuses = ['entwurf', 'gesendet', 'angenommen', 'abgelehnt']
  if (!id || !validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  }

  const supabase = await createClient()
  await supabase.from('offers').update({ status }).eq('id', id)

  return NextResponse.redirect(new URL(`/admin/angebote/${id}`, request.url))
}
