import { authOptions } from '@/lib/auth'
import { SubscriptionInSession } from '@/lib/types'
import { type SIWESession } from '@reown/appkit-siwe'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session extends SIWESession {
    address: string
    chainId: number | string
    userId: string
    ensName: string | null
    role: string
    subscriptions: SubscriptionInSession[]
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
