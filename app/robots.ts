import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://wunderlich-elektrotechnik.de'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
