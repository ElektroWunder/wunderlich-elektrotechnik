import Link from 'next/link'
import { ArrowRight, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
  variant?: 'default' | 'featured'
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  href,
  variant = 'default',
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group block rounded-xl p-6 transition-all duration-300 hover:-translate-y-1',
        variant === 'featured'
          ? 'bg-primary text-white hover:shadow-2xl hover:shadow-primary/30'
          : 'bg-white border border-gray-100 hover:border-accent/30 hover:shadow-xl hover:shadow-gray-100'
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center mb-5',
          variant === 'featured' ? 'bg-accent/20' : 'bg-accent/10'
        )}
      >
        <Icon
          className={cn(
            'w-6 h-6',
            variant === 'featured' ? 'text-accent-light' : 'text-accent'
          )}
        />
      </div>

      <h3
        className={cn(
          'text-lg font-bold mb-2',
          variant === 'featured' ? 'text-white' : 'text-primary'
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          'text-sm leading-relaxed mb-4',
          variant === 'featured' ? 'text-gray-300' : 'text-gray-500'
        )}
      >
        {description}
      </p>

      <div
        className={cn(
          'flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all duration-200',
          variant === 'featured' ? 'text-accent-light' : 'text-accent'
        )}
      >
        <span>Mehr erfahren</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  )
}
