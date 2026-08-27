import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Env-Vars nicht verfügbar (Build-Zeit) → nur children rendern
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return <>{children}</>
  }

  let user = null
  let profile = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
    if (user) {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      profile = p
    }
  } catch { /* ignore */ }

  // Kein User → nur children rendern (Middleware hat bereits redirectet oder es ist Login)
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar profile={profile} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
