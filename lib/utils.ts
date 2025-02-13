import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { User } from '@/server/db/schema'
import { AccountWithUser, ProviderType } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, { ...init, cache: 'no-store' })

  return response.json()
}

export const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const truncate = (str: string, num: number) => {
  if (!str) return ''
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}

export const getBlurDataURL = async (url: string | null) => {
  if (!url) {
    return 'data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
  }
  try {
    const response = await fetch(`https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`)
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    return `data:image/png;base64,${base64}`
  } catch (error) {
    return 'data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
  }
}

export const toDateString = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export function matchNumber(input: string, precision = 10) {
  const regex = new RegExp(`^\\d+(\\.\\d{0,${precision}}?)?$`)
  return regex.test(input)
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

export function shortenAddress(value: string = '', left = 5, right = 4) {
  return value.slice(0, left) + '...' + value.slice(-right)
}

export function getEnsAvatar(name: string) {
  return `https://euc.li/${name}`
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

export function getUrl(value = '') {
  if (value.startsWith('http')) return value
  return isIPFSCID(value) ? `/api/ipfs-image?cid=${value}` : value
}

export function isValidUUIDv4(uuid = ''): boolean {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return regex.test(uuid)
}

export function getAccountAddress(account: AccountWithUser) {
  if (account.providerType !== ProviderType.WALLET) return ''
  return account.providerAccountId || ''
}

export function getUserName(user: User) {
  const { displayName = '' } = user
  const name = user.name || ''

  if (displayName) {
    if (isAddress(displayName)) {
      return displayName.slice(0, 3) + '...' + displayName.slice(-4)
    }
    return user.displayName || user.name
  }

  if (isAddress(name)) {
    return name.slice(0, 3) + '...' + name.slice(-4)
  }
  return user.displayName || user.name
}

export const formatDate = (date: string | Date, locale = 'en-US') => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  const now = new Date(date).toLocaleDateString(locale, options)

  return now
}

export function readingTime(html: string) {
  const textOnly = html.replace(/<[^>]+>/g, '')
  const wordCount = textOnly.split(/\s+/).length
  const readingTimeMinutes = (wordCount / 200 + 1).toFixed()
  return `${readingTimeMinutes} min read`
}

export function dateRange(startDate: Date, endDate?: Date | string): string {
  const startMonth = startDate.toLocaleString('default', { month: 'short' })
  const startYear = startDate.getFullYear().toString()
  let endMonth
  let endYear

  if (endDate) {
    if (typeof endDate === 'string') {
      endMonth = ''
      endYear = endDate
    } else {
      endMonth = endDate.toLocaleString('default', { month: 'short' })
      endYear = endDate.getFullYear().toString()
    }
  }

  return `${startMonth}${startYear} - ${endMonth}${endYear}`
}
