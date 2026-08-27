import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/admin/SettingsForm'

export const metadata = { title: 'Einstellungen – Wunderlich Admin' }

export default async function EinstellungenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id ?? '').single()

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Einstellungen</h1>
        <p className="text-gray-500 text-sm mt-1">Firmendaten, Bankverbindung und Standardwerte</p>
      </div>
      <SettingsForm profile={profile} />
    </div>
  )
}
