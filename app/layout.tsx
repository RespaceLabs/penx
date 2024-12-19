import 'react-datepicker/dist/react-datepicker.css'
import '@/styles/globals.css'
import '@/styles/prosemirror.css'
import '@rainbow-me/rainbowkit/styles.css'
import { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader'
import { ThemeProvider } from '@/components/ThemeProvider'
import { getSite } from '@/lib/fetchers'
import { cn } from '@/lib/utils'
import { inter } from '@/styles/fonts'
import { Providers } from './providers'

declare global {
  interface Window {
    // __SITE__: Site
    __SITE__: any
    __USER_ID__: string
  }
}

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background text-foreground font-sans antialiased',
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
          {children}
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
