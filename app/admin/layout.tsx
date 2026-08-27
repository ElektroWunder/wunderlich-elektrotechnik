import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Env-Vars nicht verfügbar (Build-Zeit) → nur children rendern
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return <>{children}</>
  }

  const supabase = await createClient()

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch { /* ignore */ }

  // Kein User → nur children rendern (Middleware hat bereits redirectet oder es ist Login)
  if (!user) {
    return <>{children}</>
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar profile={profile} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
