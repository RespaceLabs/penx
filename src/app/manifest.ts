import { getSite } from '@/lib/fetchers'
import type { MetadataRoute } from 'next'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // if (process.env.NODE_ENV === 'development') return {}
  const site = await getSite()
  return {
    name: site.name || 'PenX',
    short_name: site.name || 'PenX',
    description: site.description || '',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/images/logo-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/logo-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
