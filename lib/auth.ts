import { prisma } from '@/lib/prisma'
import { User, UserRole } from '@prisma/client'
import { AuthTokenClaims, PrivyClient } from '@privy-io/server-auth'
import {
  getAddressFromMessage,
  getChainIdFromMessage,
  verifySignature,
  type SIWESession,
} from '@reown/appkit-siwe'
import { type NextAuthOptions } from 'next-auth'
import credentialsProvider from 'next-auth/providers/credentials'
import { Address, createPublicClient, http } from 'viem'
import { baseSepolia, mainnet } from 'viem/chains'
import { spaceAbi } from './abi'
import { PROJECT_ID, SPACE_ID } from './constants'

const nextAuthSecret = process.env.NEXTAUTH_SECRET
if (!nextAuthSecret) {
  throw new Error('NEXTAUTH_SECRET is not set')
}

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET
const privy = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!)

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export const authOptions: NextAuthOptions = {
  secret: nextAuthSecret,
  providers: [
    credentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.message) {
            throw new Error('SiweMessage is undefined')
          }
          const { message, signature } = credentials
          const address = getAddressFromMessage(message)
          const chainId = getChainIdFromMessage(message)

          const isValid = await verifySignature({
            address,
            message,
            signature,
            chainId,
            projectId: PROJECT_ID,
          })

          if (isValid) {
            const user = await createUser(address)
            updateSubscriptions(address as Address)
            return { chainId, ...user }
          }

          return null
        } catch (e) {
          return null
        }
      },
    }),
    credentialsProvider({
      id: 'privy',
      name: 'Privy',
      credentials: {
        token: {
          label: 'Token',
          type: 'text',
          placeholder: '',
        },
        address: {
          label: 'Address',
          type: 'text',
          placeholder: '',
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.token || !credentials?.address) {
            throw new Error('Token is undefined')
          }

          const { token, address } = credentials
          // console.log('====== token, address:', token, address)

          try {
            const t0 = Date.now()
            await privy.verifyAuthToken(token)
            const t1 = Date.now()
            console.log('t1-t0=======>', t1 - t0)
            const user = await createUser(address)
            const t2 = Date.now()
            console.log('t2-t1=======>', t2 - t1)
            // console.log('=====user:', user)
            updateSubscriptions(address as Address)
            return user
          } catch (error) {
            console.log('====authorize=error:', error)
            return null
          }
        } catch (e) {
          return null
        }
      },
    }),
  ],
  // pages: {
  //   signIn: `/login`,
  //   verifyRequest: `/login`,
  //   error: '/login', // Error code passed in query string as ?error=
  // },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account, user, profile, trigger, session }) {
      if (user) {
        const sessionUser = user as User & { chainId: string }
        token.uid = sessionUser.id
        token.address = sessionUser.address as string
        token.chainId = sessionUser.chainId
        token.ensName = (sessionUser.ensName as string) || null
        token.role = (sessionUser.role as string) || null

        token.subscriptions = Array.isArray(sessionUser.subscriptions)
          ? sessionUser.subscriptions.map((i: any) => ({
              planId: i.planId,
              startTime: i.startTime,
              duration: i.duration,
            }))
          : []
      }
      if (trigger === 'update') {
        const subscriptions = await updateSubscriptions(session.address as any)

        token.subscriptions = Array.isArray(subscriptions)
          ? subscriptions.map((i: any) => ({
              planId: i.planId,
              startTime: Number(i.startTime),
              duration: Number(i.duration),
            }))
          : []
      }

      // console.log('jwt token========:', token)

      return token
    },
    session({ session, token, user, trigger, newSession }) {
      session.userId = token.uid as string
      session.address = token.address as string
      session.chainId = token.chainId as string
      session.ensName = token.ensName as string
      session.role = token.role as string
      session.subscriptions = token.subscriptions as any

      return session
    },
  },
}

async function createUser(address: any) {
  let user = await prisma.user.findUnique({ where: { address } })
  const isAdmin = address === process.env.DEFAULT_ADMIN_ADDRESS
  const role = isAdmin ? UserRole.ADMIN : UserRole.AUTHOR

  if (!user) {
    user = await prisma.user.create({
      data: { address, role },
    })
  }

  return { ...user }
}

async function updateSubscriptions(address: Address) {
  try {
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    })
    const subscription = await publicClient.readContract({
      abi: spaceAbi,
      address: SPACE_ID as Address,
      functionName: 'getSubscription',
      args: [0, address],
    })

    await prisma.user.update({
      where: { address },
      data: {
        subscriptions: [
          {
            ...subscription,
            startTime: Number(subscription.startTime),
            duration: Number(subscription.duration),
            amount: subscription.amount.toString(),
          },
        ],
      },
    })
    return [subscription]
  } catch (error) {
    console.log('====== updateSubscriptions=error:', error)
    return []
  }
}
