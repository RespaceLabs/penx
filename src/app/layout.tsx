import 'react-datepicker/dist/react-datepicker.css'
import '@/styles/globals.css'
import '@/styles/prosemirror.css'
import '@rainbow-me/rainbowkit/styles.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { getSite } from '@/lib/fetchers'
import { cn } from '@/lib/utils'
import { cal, inter } from '@/styles/fonts'
import { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { headers } from 'next/headers'
import NextTopLoader from 'nextjs-toploader'
import { Providers } from './providers'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()

  return {
    title: site.name,
    description: site.description,
    // icons: ['https://penx.io/favicon.ico'],
    openGraph: {
      title: site.name,
      description: site.description,
      images: site.image ? [site.image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: site.name,
      description: site.description,
      images: site.image ? [site.image] : undefined,
      creator: site.name,
    },
    metadataBase: new URL('https://penx.io'),
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerList = headers()
  const cookies = headers().get('cookie')
  const url = headerList.get('x-current-path') || ''
  const site = await getSite()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background text-foreground font-sans antialiased',
          cal.variable,
          inter.variable,
          fontSans.variable,
        )}
      >
        <NextTopLoader
          color="#000"
          // crawlSpeed={0.08}
          height={2}
          showSpinner={false}
          template='<div class="bar" role="bar"><div class="peg"></div></div>'
        />
        <ThemeProvider
          attribute="class"
          // defaultTheme="system"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers cookies={cookies} site={site}>
            {children}
          </Providers>
        </ThemeProvider>

        {process.env.NEXT_PUBLIC_UMAMIC_WEBSITE_ID && (
          <script
            async
            defer
            src="https://umamic.penx.io/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMIC_WEBSITE_ID}
          ></script>
        )}
      </body>
    </html>
  )
}
