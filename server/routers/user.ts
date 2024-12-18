import { genSaltSync, hashSync } from 'bcrypt-edge'
import { eq, or } from 'drizzle-orm'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { z } from 'zod'
import { NETWORK, NetworkNames } from '@/lib/constants'
import { ProviderType, UserRole } from '@/lib/types'
import { TRPCError } from '@trpc/server'
import { db } from '../db'
import { accounts, users } from '../db/schema'
import { getEthPrice } from '../lib/getEthPrice'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const userRouter = router({
  list: publicProcedure.query(async ({ ctx, input }) => {
    return db.query.users.findMany({ limit: 20 })
  }),

  contributors: publicProcedure.query(async ({ ctx }) => {
    return db.query.users.findMany({
      where: or(
        eq(users.role, UserRole.ADMIN),
        eq(users.role, UserRole.AUTHOR),
      ),
      with: { accounts: true },
    })
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return (await db.query.users.findFirst({
      where: eq(users.id, ctx.token.uid),
    }))!
  }),

  getAddressByUserId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, input),
        with: { accounts: true },
      })
      if (!user) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' })
      }
      const { accounts = [] } = user
      const find = accounts.find(
        (account) => account.providerType === ProviderType.WALLET,
      )
      return find?.providerAccountId || ''
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        image: z.string(),
        name: z.string(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return db.update(users).set(input).where(eq(users.id, ctx.token.uid))
    }),

  addContributor: protectedProcedure
    .input(
      z.object({
        q: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const admin = await db.query.users.findFirst({
        where: eq(users.id, ctx.token.uid),
      })

      if (!admin) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'User not found' })
      }

      if (admin.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Only admin can update contributor',
        })
      }

      let user = await db.query.users.findFirst({
        where: eq(users.email, input.q),
      })
      if (!user) {
        const account = await db.query.accounts.findFirst({
          where: eq(accounts.providerAccountId, input.q),
        })
        if (account) {
          user = await db.query.users.findFirst({
            where: eq(users.id, account.userId),
          })
        }
      }

      if (!user) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'User not found, please check the address or email',
        })
      }
      if (user.role !== UserRole.READER) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'User is a contributor already!',
        })
      }
      return db
        .update(users)
        .set({ role: UserRole.AUTHOR })
        .where(eq(users.id, user.id))
    }),

  updateContributor: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.nativeEnum(UserRole),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, ctx.token.uid),
      })

      if (user?.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Only admin can update contributor',
        })
      }

      return db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.userId))
    }),

  deleteContributor: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, ctx.token.uid),
      })
      if (user?.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Only admin can remove contributor',
        })
      }

      if (ctx.token.uid === input.userId) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Cannot remove yourself',
        })
      }

      return db
        .update(users)
        .set({ role: UserRole.READER })
        .where(eq(users.id, input.userId))
    }),

  myAccounts: protectedProcedure.query(({ ctx }) => {
    return db.query.accounts.findMany({
      where: eq(accounts.userId, ctx.token.uid),
    })
  }),

  linkWallet: protectedProcedure
    .input(
      z.object({
        signature: z.string(),
        message: z.string(),
        address: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const publicClient = createPublicClient({
        chain: NETWORK === NetworkNames.BASE_SEPOLIA ? baseSepolia : base,
        transport: http(),
      })

      const valid = await publicClient.verifyMessage({
        address: input.address as any,
        message: input.message,
        signature: input.signature as any,
      })

      if (!valid) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid signature',
        })
      }

      const account = await db.query.accounts.findFirst({
        where: eq(accounts.providerAccountId, input.address),
      })

      if (account) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This address already linked',
        })
      }

      await db.insert(accounts).values({
        userId: ctx.token.uid,
        providerType: ProviderType.WALLET,
        providerAccountId: input.address,
      })
    }),

  linkPassword: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const account = await db.query.accounts.findFirst({
        where: eq(accounts.providerAccountId, input.username),
      })

      if (account) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This username already existed',
        })
      }

      await db.insert(accounts).values({
        userId: ctx.token.uid,
        providerType: ProviderType.PASSWORD,
        providerAccountId: input.username,
        accessToken: await hashPassword(input.password),
      })
    }),

  disconnectAccount: publicProcedure
    .input(
      z.object({
        accountId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const accountList = await db.query.accounts.findMany({
        where: eq(accounts.userId, ctx.token.uid),
      })

      if (accountList.length === 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot disconnect the last account',
        })
      }

      const account = accountList.find((a) => a.id === input.accountId)

      if (account && account.providerType === ProviderType.GOOGLE) {
        await db
          .update(users)
          .set({ email: null })
          .where(eq(users.id, ctx.token.uid))
      }

      await db.delete(accounts).where(eq(accounts.id, input.accountId))
      return true
    }),

  ethPrice: publicProcedure.query(({ ctx }) => {
    return getEthPrice()
  }),
})

async function hashPassword(password: string) {
  const salt = genSaltSync(10)
  return hashSync(password, salt)
}
