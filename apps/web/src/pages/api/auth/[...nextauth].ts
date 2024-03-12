import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { ethers } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { Provider } from 'next-auth/providers'
import credentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { prisma } from '@penx/db'

async function createUser(address: string) {
  let user = await prisma.user.findUnique({ where: { address } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        address,
        accounts: {
          create: {
            type: 'ethereum',
            provider: 'ethereum',
            providerAccountId: address,
          },
        },
      },
    })
  }

  return user
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const nextAuthSecret = process.env['NEXTAUTH_SECRET']
  if (!nextAuthSecret) {
    throw new Error('NEXTAUTH_SECRET is not set')
  }
  // Get your projectId on https://cloud.walletconnect.com
  const projectId = process.env['NEXT_PUBLIC_PROJECT_ID']
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_PROJECT_ID is not set')
  }

  const providers: Provider[] = []

  providers.push(
    ...[
      GithubProvider({
        clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID as string,
        clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET as string,
      }),

      GoogleProvider({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
        httpOptions: {
          timeout: 10 * 1000,
        },
      }),
    ],
  )

  providers.push(
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

          // const siwe = new SiweMessage(credentials.message)
          const siwe = new SiweMessage(JSON.parse(credentials.message))

          const provider = new ethers.JsonRpcProvider(
            `https://rpc.walletconnect.com/v1?chainId=eip155:${siwe.chainId}&projectId=${projectId}`,
          )
          const nonce = await getCsrfToken({ req: { headers: req.headers } })
          const result = await siwe.verify(
            {
              signature: credentials?.signature || '',
              nonce,
            },
            { provider },
          )

          if (result.success) {
            const { address } = siwe
            const user = await createUser(address)

            return user
          }

          return null
        } catch (e) {
          console.log('=========eeee:', e)

          return null
        }
      },
    }),
  )

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,

    session: {
      strategy: 'jwt',
    },

    adapter: PrismaAdapter(prisma),
    pages: {
      signIn: `/login/web2`,
      verifyRequest: `/login/web2`,
      error: '/login/web2', // Error code passed in query string as ?error=
    },

    callbacks: {
      async signIn({ user, account, profile }) {
        // await initSpace(user.id, user.name!)
        return true
      },

      async jwt({ token, account, user, profile, trigger, session }) {
        if (trigger === 'update' && session?.earlyAccessCode) {
          token.earlyAccessCode = session?.earlyAccessCode
        }

        if (user) {
          token.uid = user.id
          token.address = (user as any).address

          user.image

          token.earlyAccessCode = (user as any).earlyAccessCode

          console.log(
            '=====token.earlyAccessCode:',
            token.earlyAccessCode,
            'user--:',
            user,
            user.user,
          )
          token.email = (user as any).email
        }

        console.log('=======token:', token, 'user:', user, 'account:', account)

        return token
      },
      session({ session, token, user }) {
        console.log('session=======token:', token, 'user:', user)

        session.userId = token.uid as string
        session.address = token.address as string
        session.earlyAccessCode = token.earlyAccessCode as string
        session.email = token.email as string

        return session
      },
    },
  })
}
