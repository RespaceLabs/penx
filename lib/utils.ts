import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  return Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, '')
  const wordCount = textOnly.split(/\s+/).length
  const readingTimeMinutes = (wordCount / 200 + 1).toFixed()
  return `${readingTimeMinutes} min read`
}

/**
 * toFloorFixed(1.26, 1) -> 1.2
 * toFloorFixed(1.24899, 2) -> 1.24
 * @param input
 * @param precision
 * @returns
 */
export function toFloorFixed(input: number, precision: number): number {
  const p = Number('1' + Array(precision).fill(0).join(''))
  const str = (Math.floor(input * p) / p).toFixed(precision)
  return Number(str)
}

export function isAddress(address = ''): boolean {
  const regex = /^0x[a-fA-F0-9]{40}$/
  return regex.test(address)
}

export function isIPFSCID(str = '') {
  // v1
  const v1Regex =
    /^(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-V]{48,}|F[0-9A-F]{50,})$/

  // v0
  const v0Regex = /^([0-9A-F]{46})$/i

  return v1Regex.test(str) || v0Regex.test(str)
}
