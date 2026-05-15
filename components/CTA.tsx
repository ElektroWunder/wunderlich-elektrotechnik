import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface CTAProps {
  headline?: string
  subtext?: string
  primaryLabel?: string
  primaryHref?: string
}

export default function CTA({
  headline = 'Bereit für Ihr Projekt?',
  subtext = 'Wir beraten Sie unverbindlich – per Kontaktformular oder E-Mail. Transparente Preise, keine versteckten Kosten.',
  primaryLabel = 'Angebot anfordern',
  primaryHref = '/kontakt',
}: CTAProps) {
  return (
    <section className="bg-primary py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{headline}</h2>
        <p className="text-gray-300 text-lg max-w-xl mx-auto mb-10 leading-relaxed">{subtext}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-lg font-bold text-base transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
          >
            {primaryLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
