'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/leistungen', label: 'Leistungen' },
  { href: '/ueber-mich', label: 'Über mich' },
  { href: '/referenzen', label: 'Referenzen' },
  { href: '/kontakt', label: 'Kontakt' },
]

function Logo({ scrolled }: { scrolled: boolean }) {
  return (
    <Link href="/" className="flex items-center group">
      {/* Wrapper crops the bottom text portion of the logo image */}
      <div className={cn(
        'relative transition-all duration-300',
        scrolled ? 'w-16 h-10 sm:w-20 sm:h-12' : 'w-28 h-16 sm:w-36 sm:h-20'
      )}>
        <Image
          src="/logo.png"
          alt="Wunderlich Elektrotechnik Logo"
          fill
          className="object-contain"
          priority
          onError={(e) => {
            ;(e.target as HTMLImageElement).parentElement!.style.display = 'none'
            const fallback = document.getElementById('logo-fallback')
            if (fallback) fallback.style.display = 'flex'
          }}
        />
      </div>
      <div id="logo-fallback" className="items-center gap-2.5" style={{ display: 'none' }}>
        <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-lg">
          <span className="text-white font-black text-base leading-none">
            W<span className="text-accent">E</span>
          </span>
        </div>
        <div className="leading-tight">
          <span className="block text-sm font-black text-primary tracking-tight uppercase">
            Wunderlich
          </span>
          <span className="block text-[10px] text-accent font-semibold tracking-widest uppercase">
            Elektrotechnik
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          'flex items-center justify-between transition-all duration-300',
          scrolled ? 'h-14 sm:h-16' : 'h-28 sm:h-32'
        )}>
          <Logo scrolled={scrolled} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Angebot CTA – Desktop */}
          <a
            href="/kontakt"
            className="hidden md:flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors duration-200"
          >
            Angebot anfragen
          </a>

          {/* Hamburger – Mobile */}
          <button
            className="md:hidden p-2 rounded-md text-primary"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü öffnen"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-4 pt-4 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <a
                href="/kontakt"
                className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-4 py-3 rounded-lg font-semibold text-base w-full transition-colors"
              >
                Angebot anfragen
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
