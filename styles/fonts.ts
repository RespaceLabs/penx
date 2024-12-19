import { Inter, Lora, Work_Sans } from 'next/font/google'

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const lora = Lora({
  variable: '--font-title',
  subsets: ['latin'],
  weight: '600',
  display: 'swap',
})
export const work = Work_Sans({
  variable: '--font-title',
  subsets: ['latin'],
  weight: '600',
  display: 'swap',
})

export const fontMapper = {
  'font-lora': lora.variable,
  'font-work': work.variable,
} as Record<string, string>
