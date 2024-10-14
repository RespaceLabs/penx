import { authOptions } from '@/lib/auth'
import { type SIWESession } from '@reown/appkit-siwe'
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session extends SIWESession {
    address: string
    chainId: number | string
    userId: string
    ensName: string | null
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
