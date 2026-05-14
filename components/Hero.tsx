import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

interface HeroProps {
  headline: string
  subheadline: string
  imageUrl: string
  imageAlt: string
  badge?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  overlay?: 'dark' | 'medium'
}

export default function Hero({
  headline,
  subheadline,
  imageUrl,
  imageAlt,
  badge,
  primaryCta = { label: 'Angebot anfordern', href: '/kontakt' },
  secondaryCta,
  overlay = 'dark',
}: HeroProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 ${
          overlay === 'dark'
            ? 'bg-gradient-to-r from-primary/90 via-primary/75 to-primary/40'
            : 'bg-gradient-to-r from-primary/80 via-primary/60 to-primary/30'
        }`}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="max-w-2xl animate-slide-up">
          {badge && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span className="text-white text-sm font-medium">{badge}</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {headline}
          </h1>

          <p className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-8 max-w-xl">
            {subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-6 py-3.5 rounded-lg font-semibold text-base transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              {primaryCta.label}
              <ArrowRight className="w-4 h-4" />
            </Link>

            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3.5 rounded-lg font-semibold text-base transition-all duration-200 backdrop-blur-sm"
              >
                {secondaryCta.label}
              </Link>
            ) : (
              <a
                href="tel:+4917684995287"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3.5 rounded-lg font-semibold text-base transition-all duration-200 backdrop-blur-sm"
              >
                <Phone className="w-4 h-4" />
                Direkt anrufen
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
