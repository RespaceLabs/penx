'use client'

import { ThemeProvider } from 'next-themes'
import siteMetadata from '@/content/siteMetadata'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
      {children}
    </ThemeProvider>
  )
}
