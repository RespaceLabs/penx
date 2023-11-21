import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@penx/db'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
    // ...add more providers here
  ],
  session: {
    strategy: 'jwt',
  },

  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: `/`,
    verifyRequest: `/`,
    error: '/', // Error code passed in query string as ?error=
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('user, account:', user, 'account:', account)
      // await initSpace(user.id, user.name!)
      return true
    },

    async jwt({ token, account, user, profile }) {
      if (user) {
        token.uid = user.id
      }

      // Persist the OAuth access_token to the token right after signin

      if (account) {
        // Save the access token and refresh token in the JWT on the initial login
        return {
          ...token,
          accessToken: account.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + account.expires_at!),
          refreshToken: account.refresh_token,
        } as JWT
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken as string
      session.userId = token.uid as string
      ;(session.user as any).id = token.uid
      return session
    },
  },
})
