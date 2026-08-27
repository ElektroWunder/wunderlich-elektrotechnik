import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pathname als Request-Header weiterleiten (für Layout lesbar)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Login-Seite immer durchlassen
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  // Alle anderen /admin-Seiten: Session prüfen
  if (pathname.startsWith('/admin')) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    let user = null
    try {
      const { data } = await supabase.auth.getUser()
      user = data.user
    } catch { /* ignore */ }

    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return supabaseResponse
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
