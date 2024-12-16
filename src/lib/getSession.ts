import { User, UserRole } from '@prisma/client'
import NextAuth, { getServerSession, type NextAuthOptions } from 'next-auth'
import { SubscriptionInSession } from './types'

export async function getSession() {
  return getServerSession() as Promise<{
    user: {
      id: string
      name: string
      username: string
      email: string
      image: string
    }
    userId: string
    address: string
    chainId: string
    ensName: string
    role: UserRole
    subscriptions: SubscriptionInSession[]
  } | null>
}
