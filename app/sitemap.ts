import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wunderlich-elektrotechnik.de'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const routes = [
    { url: '/', priority: 1.0, changeFrequency: 'monthly' as const },
    { url: '/leistungen', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/leistungen/klimaanlagen', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/leistungen/waermepumpen', priority: 0.9, changeFrequency: 'monthly' as const },
    { url: '/leistungen/elektroinstallation', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/leistungen/photovoltaik', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/leistungen/wallbox', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/leistungen/wartung', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/leistungen/klimaanlagen-witten', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/ueber-mich', priority: 0.7, changeFrequency: 'yearly' as const },
    { url: '/referenzen', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/kontakt', priority: 0.8, changeFrequency: 'yearly' as const },
    { url: '/impressum', priority: 0.3, changeFrequency: 'yearly' as const },
    { url: '/datenschutz', priority: 0.3, changeFrequency: 'yearly' as const },
    { url: '/agb', priority: 0.2, changeFrequency: 'yearly' as const },
  ]

  return routes.map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
