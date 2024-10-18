import { prisma } from '@/lib/prisma'
import { User, UserRole } from '@prisma/client'
import {
  getAddressFromMessage,
  getChainIdFromMessage,
  verifySignature,
  type SIWESession,
} from '@reown/appkit-siwe'
import NextAuth, { getServerSession, type NextAuthOptions } from 'next-auth'
import credentialsProvider from 'next-auth/providers/credentials'
import { Address, createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { PROJECT_ID } from './constants'

const nextAuthSecret = process.env.NEXTAUTH_SECRET
if (!nextAuthSecret) {
  throw new Error('NEXTAUTH_SECRET is not set')
}

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
            return { chainId, ...user }
          }

          return null
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
      }

      // console.log('jwt token========:', token)

      return token
    },
    session({ session, token, user }) {
      session.userId = token.uid as string
      session.address = token.address as string
      session.chainId = token.chainId as string
      session.ensName = token.ensName as string
      session.role = token.role as string

      return session
    },
  },
}

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string
      name: string
      username: string
      email: string
      image: string
    }
  } | null>
}

async function createUser(address: any) {
  let user = await prisma.user.findUnique({ where: { address } })

  let ensName: string | null = ''
  try {
    ensName = await publicClient.getEnsName({ address })
  } catch (error) {}

  const isAdmin = address === process.env.DEFAULT_ADMIN_ADDRESS
  const role = isAdmin ? UserRole.ADMIN : UserRole.AUTHOR

  if (!user) {
    user = await prisma.user.create({
      data: { address, ensName, role },
    })
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: { ensName: ensName, role },
    })
  }

  return { ...user, ensName }
}
