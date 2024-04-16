import type {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
} from '@auth/core/adapters'
import type { Prisma, PrismaClient } from '@prisma/client'

export function PrismaAdapter(
  prisma: PrismaClient | ReturnType<PrismaClient['$extends']>,
): Adapter {
  const p = prisma as PrismaClient

  return {
    // We need to let Prisma generate the ID because our default UUID is incompatible with MongoDB
    createUser: ({ id: _id, ...data }) => {
      console.log('createUser=======data:', data, 'id:', _id)

      return p.user.create({ data }) as any
    },
    getUser: (id) => {
      console.log('getUser=======id:', id)
      return p.user.findUnique({ where: { id } }) as any
    },
    getUserByEmail: (email) => p.user.findUnique({ where: { email } }) as any,
    async getUserByAccount(provider_providerAccountId) {
      console.log('============getUserByAccount:', provider_providerAccountId)

      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        select: { user: true },
      })
      return (account?.user as AdapterUser) ?? null
    },
    updateUser: ({ id, ...data }) =>
      p.user.update({ where: { id }, data }) as Promise<AdapterUser>,
    deleteUser: (id) =>
      p.user.delete({ where: { id } }) as Promise<AdapterUser>,
    linkAccount: async (data) => {
      const { userId, ...rest } = data
      console.log('====linkAccount:', data)
      await p.user.update({
        where: { id: userId },
        data: { google: rest },
      })

      return p.account.create({ data }) as unknown as AdapterAccount
    },

    unlinkAccount: (provider_providerAccountId) =>
      p.account.delete({
        where: { provider_providerAccountId },
      }) as unknown as AdapterAccount,
    async getSessionAndUser(sessionToken) {
      const userAndSession = await p.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      })
      if (!userAndSession) return null
      const { user, ...session } = userAndSession
      return { user, session } as { user: AdapterUser; session: AdapterSession }
    },
    createSession: (data) => p.session.create({ data }),
    updateSession: (data) =>
      p.session.update({ where: { sessionToken: data.sessionToken }, data }),
    deleteSession: (sessionToken) =>
      p.session.delete({ where: { sessionToken } }),
    async getAccount(providerAccountId, provider) {
      console.log(
        'getAccount=======providerAccountId:',
        providerAccountId,
        'provider:',
        provider,
      )

      return p.account.findFirst({
        where: { providerAccountId, provider },
      }) as Promise<AdapterAccount | null>
    },
  }
}
