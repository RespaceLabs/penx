import { PrismaAdapter } from '@next-auth/prisma-adapter'
import type { SIWESession } from '@web3modal/core'
import { ethers } from 'ethers'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { Provider } from 'next-auth/providers'
import CredentialsProvider from 'next-auth/providers/credentials'
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

const providers: Provider[] = [
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
]

if (process.env.NEXT_PUBLIC_DEPLOY_MODE === 'SELF_HOSTED') {
  providers
    .push
    // CredentialsProvider({
    //   name: 'SelfHosted',
    //   credentials: {
    //     username: { label: 'Username', type: 'text', placeholder: '' },
    //     password: { label: 'Password', type: 'password' },
    //   },
    //   async authorize(credentials, req) {
    //     const [username, password] = (
    //       process.env.SELF_HOSTED_CREDENTIALS as string
    //     ).split('/')

    //     // console.log(
    //     //   'process.env.SELF_HOSTED_CREDENTIALS:',
    //     //   process.env.SELF_HOSTED_CREDENTIALS,
    //     //   'username, password:',
    //     //   username,
    //     //   password,
    //     //   'NEXTAUTH_SECRET:',
    //     //   process.env.NEXTAUTH_SECRET,
    //     // )

    //     if (
    //       username === credentials!.username &&
    //       password === credentials!.password
    //     ) {
    //       let user = await prisma.user.findFirst({
    //         where: { username, password },
    //       })

    //       if (!user) {
    //         user = await prisma.user.create({
    //           data: { username, password, name: username },
    //         })
    //       }

    //       return {
    //         id: user.id,
    //         name: user.username || user.name,
    //         email: user.email || '',
    //         image: '',
    //       }
    //     } else {
    //       return null
    //     }
    //   },
    // }),
    ()
}

providers.push(
  CredentialsProvider({
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
    async authorize(credentials, req) {
      console.log('authorize=siwe===============')

      try {
        if (!credentials?.message) {
          throw new Error('SiweMessage is undefined')
        }

        const siwe = new SiweMessage(JSON.parse(credentials.message || '{}'))

        const nextAuthUrl = new URL(process.env.NEXT_PUBLIC_NEXTAUTH_URL!)

        const nonce = await getCsrfToken({ req })

        const result = await siwe.verify({
          signature: credentials?.signature || '',
          domain: nextAuthUrl.host,
          nonce,
        })

        if (result.success) {
          const { address } = siwe
          const user = await createUser(address)

          return {
            id: user.id,
            address,
          }
        }

        return null
      } catch (e) {
        console.log('eeeeeeeeeeeee======:', e)

        return null
      }
    },
  }),
)

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers,
  session: {
    strategy: 'jwt',
    // maxAge: 2592000 * 30,
  },

  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: `/login`,
    verifyRequest: `/login`,
    error: '/login', // Error code passed in query string as ?error=
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // await initSpace(user.id, user.name!)
      return true
    },

    async jwt({ token, account, user, profile }) {
      if (user) {
        // console.log('jwt==========:', user)
        token.uid = user.id
        token.address = (user as any).address
      }

      return token
    },
    async session({ session, token, user, ...rest }) {
      // console.log('session==========:', session, 'user:', user)

      session.userId = token.uid as string
      session.address = token.address as string
      ;(session.user as any).id = token.uid

      return session
    },
  },
}

export default NextAuth(authOptions)
