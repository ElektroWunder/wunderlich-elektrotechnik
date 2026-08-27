'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Check } from 'lucide-react'
import type { Profile } from '@/lib/supabase/types'

interface Props { profile: Profile | null }

export default function SettingsForm({ profile }: Props) {
  const [name, setName] = useState(profile?.name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [calendarId, setCalendarId] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ name, phone: phone || null }).eq('id', user.id)
    }
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const field = (label: string, value: string, onChange: (v: string) => void, opts?: { type?: string; placeholder?: string; hint?: string }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={opts?.type ?? 'text'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={opts?.placeholder}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors"
      />
      {opts?.hint && <p className="text-xs text-gray-400 mt-1">{opts.hint}</p>}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Profil */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-primary mb-5">Mein Profil</h2>
        <div className="space-y-4">
          {field('Name', name, setName)}
          {field('Telefon', phone, setPhone, { type: 'tel' })}
        </div>
      </div>

      {/* Google Kalender */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-primary mb-2">Google Kalender</h2>
        <p className="text-sm text-gray-500 mb-5">
          Kalender-ID aus den Google Calendar Einstellungen (unter „Kalender freigeben").
        </p>
        <div className="space-y-4">
          {field(
            'Kalender-ID',
            calendarId,
            setCalendarId,
            {
              placeholder: 'xyz@group.calendar.google.com',
              hint: 'Google Calendar → Einstellungen → Kalender → Kalender-ID',
            }
          )}
        </div>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
          <strong>Einrichtung:</strong> Den Wert <code className="bg-blue-100 px-1 rounded">GOOGLE_CALENDAR_ID</code> in den Vercel-Umgebungsvariablen setzen.
          Den Google-Kalender auf „Öffentlich" stellen damit das Einbetten funktioniert.
        </div>
      </div>

      {/* Firmendaten-Hinweis */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-primary mb-2">Firmendaten in PDFs</h2>
        <p className="text-sm text-gray-500 mb-4">
          Straße, PLZ, Ort, IBAN, BIC und Bankname direkt in den PDF-Routen eintragen:
        </p>
        <div className="space-y-2 text-sm font-mono text-gray-500">
          <div className="bg-gray-50 p-3 rounded-lg">app/api/pdf/angebot/[id]/route.tsx</div>
          <div className="bg-gray-50 p-3 rounded-lg">app/api/pdf/rechnung/[id]/route.tsx</div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Suche nach <code>[Straße]</code>, <code>[IBAN]</code>, <code>[BIC]</code> etc. und ersetze die Platzhalter.</p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="bg-accent hover:bg-accent-light disabled:opacity-50 text-white text-sm font-medium px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saved ? 'Gespeichert!' : 'Speichern'}
        </button>
      </div>
    </div>
  )
}
