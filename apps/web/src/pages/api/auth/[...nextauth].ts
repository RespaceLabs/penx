import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { ethers } from 'ethers'
import { nanoid } from 'nanoid'
import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { Provider } from 'next-auth/providers'
import credentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { SyncServerType } from '@penx/constants'
import { prisma, User } from '@penx/db'

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
        authorization: {
          params: {
            scope:
              'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.file',
            access_type: 'offline',
            prompt: 'consent',
          },
        },
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

    adapter: PrismaAdapter(prisma) as any,
    pages: {
      // signIn: `/login/web2`,
      // verifyRequest: `/login/web2`,
      // error: '/login/web2', // Error code passed in query string as ?error=

      signIn: `/login`,
      verifyRequest: `/login`,
      error: '/login', // Error code passed in query string as ?error=
    },

    callbacks: {
      async signIn({ user, account, profile }) {
        // await initSpace(user.id, user.name!)

        return true
      },

      async jwt({ token, account, user, profile, trigger, session }) {
        console.log(
          'jwt user=======:',
          user,
          'account:',
          account,
          'profile:',
          profile,
        )

        if (trigger === 'update') {
          if (session?.earlyAccessCode) {
            token.earlyAccessCode = session?.earlyAccessCode
          }

          if (session?.publicKey) {
            token.publicKey = session?.publicKey
          }
        }

        if (user) {
          const penxUser = user as User
          token.uid = penxUser.id
          token.address = penxUser.address as string
          token.earlyAccessCode = penxUser.earlyAccessCode as string
          token.publicKey = penxUser.publicKey as string
          token.email = penxUser.email as string

          if (!penxUser.connectedSyncServerId) {
            await initUserSyncServer(penxUser.id)
          }

          initPersonalToken(penxUser.id)
        }

        if (
          user?.id &&
          !(user as any)?.google?.refresh_token &&
          account?.refresh_token
        ) {
          console.log('update google info................')

          await prisma.user.update({
            where: { id: user.id },
            data: {
              google: {
                ...account,
                email: profile?.email,
                picture: (profile as any)?.picture,
              },
            },
          })
        }

        return token
      },
      session({ session, token, user }) {
        session.userId = token.uid as string
        session.address = token.address as string
        session.earlyAccessCode = token.earlyAccessCode as string
        session.publicKey = token.publicKey as string
        session.email = token.email as string

        return session
      },
    },
  })
}

async function initUserSyncServer(userId: string) {
  const syncServer = await prisma.syncServer.findFirst({
    where: {
      type: SyncServerType.OFFICIAL,
      url: { not: '' },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (syncServer) {
    await prisma.user.update({
      where: { id: userId },
      data: { connectedSyncServerId: syncServer.id },
    })
  }
}

async function initPersonalToken(userId: string) {
  const tokens = await prisma.personalToken.findMany({ where: { userId } })

  if (tokens.length) return

  await prisma.personalToken.create({
    data: {
      description: 'Personal Token 1',
      userId,
      value: nanoid(),
    },
  })
}

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
