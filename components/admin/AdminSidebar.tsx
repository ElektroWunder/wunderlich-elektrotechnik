'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/supabase/types'
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Wrench,
  Calendar,
  UserCog,
  Clock,
  FileCheck,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/kunden', label: 'Kunden', icon: Users },
  { href: '/admin/angebote', label: 'Angebote', icon: FileText },
  { href: '/admin/rechnungen', label: 'Rechnungen', icon: Receipt },
  { href: '/admin/bausteine', label: 'Bausteine', icon: Wrench },
  { href: '/admin/zeiterfassung', label: 'Zeiterfassung', icon: Clock },
  { href: '/admin/kalender', label: 'Kalender', icon: Calendar },
  { href: '/admin/team', label: 'Team', icon: UserCog },
  { href: '/admin/dokumente', label: 'Dokumente', icon: FileCheck },
]

const futureItems: never[] = []

interface Props {
  profile: Profile | null
}

export default function AdminSidebar({ profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-60 bg-primary flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Wunderlich</p>
            <p className="text-gray-400 text-[10px]">Elektrotechnik</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-accent/20 text-white font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-accent" />}
            </Link>
          )
        })}

      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/5 space-y-0.5">
        <Link
          href="/admin/einstellungen"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Einstellungen
        </Link>
        <div className="px-3 py-2 flex items-center gap-3">
          <div className="w-7 h-7 bg-accent/30 rounded-full flex items-center justify-center shrink-0">
            <span className="text-accent text-xs font-bold">
              {profile?.name?.charAt(0).toUpperCase() ?? 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{profile?.name ?? 'Benutzer'}</p>
            <p className="text-gray-500 text-[10px] capitalize">{profile?.role ?? 'employee'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-400 transition-colors"
            title="Abmelden"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
