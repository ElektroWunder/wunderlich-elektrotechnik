import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CookieBanner from '@/components/CookieBanner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://wunderlich-elektrotechnik.de'
  ),
  title: {
    default: 'Wunderlich Elektrotechnik – Klima, Kälte, Strom aus einer Hand | Witten',
    template: '%s | Wunderlich Elektrotechnik',
  },
  description:
    'Meisterbetrieb für Elektroinstallation, Klimaanlagen, Wärmepumpen und Photovoltaik im Ennepe-Ruhr-Kreis. 13+ Jahre Erfahrung. Kältemittelzertifiziert (Kat. I). Vor-Ort-Besichtigung nach Vereinbarung.',
  keywords: [
    'Elektriker Witten',
    'Klimaanlage Witten',
    'Wärmepumpe EN-Kreis',
    'Photovoltaik Witten',
    'Wallbox installieren Witten',
    'Elektrotechnik Ennepe-Ruhr-Kreis',
    'Meisterbetrieb Witten',
  ],
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: 'Wunderlich Elektrotechnik',
    images: [
      {
        url: 'https://wunderlich-elektrotechnik.de/logo-text.png',
        width: 601,
        height: 599,
        alt: 'Wunderlich Elektrotechnik – Klima, Kälte, Strom aus einer Hand',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://wunderlich-elektrotechnik.de',
  name: 'Wunderlich Elektrotechnik',
  description:
    'Meisterbetrieb für Elektroinstallation, Klimaanlagen, Wärmepumpen und Photovoltaik im Ennepe-Ruhr-Kreis.',
  url: 'https://wunderlich-elektrotechnik.de',
  telephone: '+4915207541151',
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Casinostraße 2',
    addressLocality: 'Witten',
    postalCode: '58452',
    addressRegion: 'Nordrhein-Westfalen',
    addressCountry: 'DE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.4397,
    longitude: 7.3527,
  },
  areaServed: [
    'Witten',
    'Wetter (Ruhr)',
    'Sprockhövel',
    'Hattingen',
    'Gevelsberg',
    'Ennepetal',
    'Breckerfeld',
    'Schwelm',
    'Herdecke',
    'Hagen',
    'Ennepe-Ruhr-Kreis',
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '20:00',
      description: 'Termine nach Vereinbarung',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Leistungen',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Klimaanlagen-Installation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Wärmepumpen' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Elektroinstallation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Photovoltaik' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Wallbox' } },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <head>
        <meta property="og:image" content="https://wunderlich-elektrotechnik.de/logo-text.png" />
        <meta property="og:image:width" content="601" />
        <meta property="og:image:height" content="599" />
        <meta name="twitter:image" content="https://wunderlich-elektrotechnik.de/logo-text.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main className="pt-32 sm:pt-36">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}
