import { createClient } from '@/lib/supabase/server'
import { Users } from 'lucide-react'

export const metadata = { title: 'Team – Wunderlich Admin' }

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: profiles } = await supabase.from('profiles').select('*').order('name')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Team</h1>
        <p className="text-gray-500 text-sm mt-1">Mitarbeiter und Rollen</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles?.map((profile) => (
          <div key={profile.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
              <span className="text-accent font-bold text-lg">{profile.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold text-primary">{profile.name}</p>
              <p className="text-xs text-gray-400 capitalize">{profile.role === 'owner' ? 'Inhaber' : 'Mitarbeiter'}</p>
              {profile.phone && <p className="text-xs text-gray-500 mt-0.5">{profile.phone}</p>}
            </div>
          </div>
        ))}
        {(!profiles || profiles.length === 0) && (
          <div className="sm:col-span-2 lg:col-span-3 text-center py-16">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Noch keine Teammitglieder.</p>
            <p className="text-gray-400 text-xs mt-1">Nutzer über Supabase Auth anlegen – Profil wird automatisch erstellt.</p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-700">
        <p className="font-semibold mb-2">Neuen Mitarbeiter hinzufügen</p>
        <p>Im Supabase Dashboard unter <strong>Authentication → Users → Invite user</strong> eine E-Mail-Einladung versenden. Das Profil wird automatisch angelegt.</p>
      </div>
    </div>
  )
}
