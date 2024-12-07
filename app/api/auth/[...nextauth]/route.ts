import { spaceAbi } from '@/lib/abi'
import {
  defaultPostContent,
  NETWORK,
  NetworkNames,
  PROJECT_ID,
} from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { AccountWithUser, SubscriptionInSession } from '@/lib/types'
import { getAccountAddress } from '@/lib/utils'
import {
  PostStatus,
  PostType,
  ProviderType,
  User,
  UserRole,
} from '@prisma/client'
import { AuthTokenClaims, PrivyClient } from '@privy-io/server-auth'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import credentialsProvider from 'next-auth/providers/credentials'
import { Address, createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import {
  parseSiweMessage,
  validateSiweMessage,
  type SiweMessage,
} from 'viem/siwe'

type GoogleLoginInfo = {
  email: string
  openid: string
  picture: string
  name: string
}

declare module 'next-auth' {
  interface Session {
    address: string
    name: string
    picture: string
    userId: string
    ensName: string | null
    role: string
    subscriptions: SubscriptionInSession[]
  }
}

export { handler as GET, handler as POST }

async function handler(req: Request, res: Response) {
  const nextAuthSecret = await getAuthSecret()
  if (!nextAuthSecret) {
    throw new Error('NEXTAUTH_SECRET is not set')
  }

  const host = req.headers.get('host')

  process.env.NEXTAUTH_URL =
    process.env.NEXTAUTH_URL ||
    (/localhost/.test(host || '') ? `http://${host}` : `https://${host}`)

  return await NextAuth(req as any, res as any, {
    secret: nextAuthSecret,
    providers: [
      credentialsProvider({
        name: 'Ethereum',
        credentials: {
          message: {
            label: 'Message',
            placeholder: '0x0',
            type: 'text',
          },
          signature: {
            label: 'Signature',
            placeholder: '0x0',
            type: 'text',
          },
        },
        async authorize(credentials: any) {
          try {
            const siweMessage = parseSiweMessage(
              credentials?.message,
            ) as SiweMessage

            if (
              !validateSiweMessage({
                address: siweMessage?.address,
                message: siweMessage,
              })
            ) {
              return null
            }

            // const nextAuthUrl =
            //   process.env.NEXTAUTH_URL ||
            //   (process.env.VERCEL_URL
            //     ? `https://${process.env.VERCEL_URL}`
            //     : null)
            // if (!nextAuthUrl) {
            //   return null
            // }

            // const nextAuthHost = new URL(nextAuthUrl).host
            // if (siweMessage.domain !== nextAuthHost) {
            //   return null
            // }

            const publicClient = createPublicClient({
              chain: getChain(),
              transport: http(),
            })

            const valid = await publicClient.verifyMessage({
              address: siweMessage?.address,
              message: credentials?.message,
              signature: credentials?.signature,
            })

            if (!valid) {
              return null
            }
            const address = siweMessage.address

            const user = await createUserByAddress(address)
            updateSubscriptions(address as Address)
            return { ...user }
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
            const site = await prisma.site.findFirst()
            if (!site) return null

            const authConfig = site.authConfig as any
            const privy = new PrivyClient(
              authConfig.privyAppId,
              authConfig.privyAppSecret,
            )

            try {
              const t0 = Date.now()
              await privy.verifyAuthToken(token)
              const t1 = Date.now()
              console.log('t1-t0=======>', t1 - t0)
              const user = await createUserByAddress(address)
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

      credentialsProvider({
        id: 'penx-google',
        name: 'PenX',
        credentials: {
          email: {
            label: 'Email',
            type: 'text',
            placeholder: '',
          },
          openid: {
            label: 'OpenID',
            type: 'text',
            placeholder: '',
          },
          picture: {
            label: 'Picture',
            type: 'text',
            placeholder: '',
          },
          name: {
            label: 'Picture',
            type: 'text',
            placeholder: '',
          },
        },
        async authorize(credentials) {
          try {
            console.log('>>>>> gogle auth..............:', credentials)

            if (!credentials?.email || !credentials?.openid) {
              throw new Error('Login fail')
            }

            const user = await createUserByGoogleInfo(credentials)
            return user
          } catch (e) {
            console.log('error=====:', e)

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
          const sessionAccount = user as AccountWithUser
          token.uid = sessionAccount.user.id
          token.address = getAccountAddress(sessionAccount)
          token.ensName = sessionAccount.user?.ensName as string
          token.name = sessionAccount.user.name as string
          token.picture = sessionAccount.user.image as string
          token.role = sessionAccount.user.role as string

          token.subscriptions = Array.isArray(sessionAccount.user.subscriptions)
            ? sessionAccount.user.subscriptions.map((i: any) => ({
                planId: i.planId,
                startTime: i.startTime,
                duration: i.duration,
              }))
            : []
        }
        if (trigger === 'update') {
          const subscriptions = await updateSubscriptions(
            session.address as any,
          )

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
        session.name = token.name as string
        session.picture = token.picture as string
        session.role = token.role as string
        session.subscriptions = token.subscriptions as any

        return session
      },
    },
  })
}

async function createUserByAddress(address: any) {
  return prisma.$transaction(
    async (tx) => {
      const account = await tx.account.findUnique({
        where: { providerAccountId: address },
        include: {
          user: true,
        },
      })

      if (account) return account

      const count = await tx.user.count()

      let newUser = await tx.user.create({
        data: {
          name: address,
          displayName: address,
          role: count === 0 ? UserRole.ADMIN : UserRole.READER,
          accounts: {
            create: [
              {
                providerType: ProviderType.WALLET,
                providerAccountId: address,
              },
            ],
          },
        },
      })

      await tx.post.create({
        data: {
          userId: newUser.id,
          type: PostType.ARTICLE,
          title: 'Welcome to PenX!',
          content: JSON.stringify(defaultPostContent),
          postStatus: PostStatus.PUBLISHED,
        },
      })

      return tx.account.findUniqueOrThrow({
        where: { providerAccountId: address },
        include: {
          user: true,
        },
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}

async function createUserByGoogleInfo(info: GoogleLoginInfo) {
  return prisma.$transaction(
    async (tx) => {
      const account = await tx.account.findUnique({
        where: { providerAccountId: info.openid },
        include: {
          user: true,
        },
      })

      if (account) return account

      const count = await tx.user.count()

      let newUser = await tx.user.create({
        data: {
          name: info.name,
          displayName: info.name,
          email: info.email,
          image: info.picture,
          role: count === 0 ? UserRole.ADMIN : UserRole.READER,
          accounts: {
            create: [
              {
                providerType: ProviderType.GOOGLE,
                providerAccountId: info.openid,
                providerInfo: info,
              },
            ],
          },
        },
      })

      await tx.post.create({
        data: {
          userId: newUser.id,
          type: PostType.ARTICLE,
          title: 'Welcome to PenX!',
          content: JSON.stringify(defaultPostContent),
          postStatus: PostStatus.PUBLISHED,
        },
      })

      return tx.account.findUniqueOrThrow({
        where: { providerAccountId: info.openid },
        include: {
          user: true,
        },
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}

async function updateSubscriptions(address: Address) {
  const site = await prisma.site.findFirst()
  if (!site?.spaceId) return []
  try {
    const publicClient = createPublicClient({
      chain: getChain(),
      transport: http(),
    })
    const subscription = await publicClient.readContract({
      abi: spaceAbi,
      address: site?.spaceId as Address,
      functionName: 'getSubscription',
      args: [0, address],
    })

    // await prisma.user.update({
    //   where: { address },
    //   data: {
    //     subscriptions: [
    //       {
    //         ...subscription,
    //         startTime: Number(subscription.startTime),
    //         duration: Number(subscription.duration),
    //         amount: subscription.amount.toString(),
    //       },
    //     ],
    //   },
    // })
    return [subscription]
  } catch (error) {
    console.log('====== updateSubscriptions=error:', error)
    return []
  }
}

let secret = ''

async function getAuthSecret() {
  let nextAuthSecret = process.env.NEXTAUTH_SECRET
  if (nextAuthSecret) return nextAuthSecret
  if (secret) return secret

  const site = await prisma.site.findFirst({
    select: {
      authSecret: true,
    },
  })
  secret = site?.authSecret || ''
  return site?.authSecret || ''
}

function getChain() {
  if (NETWORK === NetworkNames.BASE_SEPOLIA) {
    return baseSepolia
  }
  return base
}
