import { ReactNode } from 'react'
import { Analytics } from '@/components/Analytics'
import { getSite } from '@/lib/fetchers'
import { loadTheme } from '@/themes/theme-loader'
import { Providers } from '../providers'

export const runtime = 'edge'
// export const dynamic = 'force-static'
// export const revalidate = 3600 * 24

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const site = await getSite()
  const { SiteLayout } = loadTheme(site.themeName)
  return (
    <>
      <Providers>
        <SiteLayout site={site}>{children}</SiteLayout>
      </Providers>
      {site.analytics?.umamiHost && site.analytics?.umamiWebsiteId && (
        <script
          async
          defer
          src={
            `${site.analytics.umamiHost}/script.js` || 'https://cloud.umami.is'
          }
          data-website-id={site.analytics.umamiWebsiteId}
        ></script>
      )}

      {site.analytics?.gaMeasurementId && (
        <Analytics gaMeasurementId={site.analytics?.gaMeasurementId} />
      )}
    </>
  )
}
