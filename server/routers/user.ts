import { NETWORK, NetworkNames } from '@/lib/constants'
import { prisma } from '@/lib/prisma'
import { ProviderType, UserRole } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { createPublicClient, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { z } from 'zod'
import { getEthPrice } from '../lib/getEthPrice'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const userRouter = router({
  list: publicProcedure.query(async ({ ctx, input }) => {
    return prisma.user.findMany({ take: 20 })
  }),

  contributors: publicProcedure.query(async ({ ctx }) => {
    return prisma.user.findMany({
      where: {
        OR: [{ role: UserRole.ADMIN }, { role: UserRole.AUTHOR }],
      },
      include: { accounts: true },
    })
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return prisma.user.findUnique({ where: { id: ctx.token.uid } })
  }),

  getAddressByUserId: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const { accounts = [] } = await prisma.user.findUniqueOrThrow({
        where: { id: input },
        include: { accounts: true },
      })
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
      return prisma.user.update({
        where: { id: ctx.token.uid },
        data: {
          ...input,
        },
      })
    }),

  addContributor: protectedProcedure
    .input(
      z.object({
        q: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const admin = await prisma.user.findFirstOrThrow({
        where: { id: ctx.token.uid },
      })

      if (admin.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Only admin can update contributor',
        })
      }

      let user = await prisma.user.findFirst({
        where: {
          OR: [{ email: input.q }],
        },
      })
      if (!user) {
        const account = await prisma.account.findFirst({
          where: { providerAccountId: input.q },
        })
        if (account) {
          user = await prisma.user.findUnique({ where: { id: account.userId } })
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
      return prisma.user.update({
        where: { id: user.id },
        data: { role: UserRole.AUTHOR },
      })
    }),

  updateContributor: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.nativeEnum(UserRole),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findFirstOrThrow({
        where: { id: ctx.token.uid },
      })
      if (user.role !== UserRole.ADMIN) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Only admin can update contributor',
        })
      }

      return prisma.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      })
    }),

  deleteContributor: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findFirstOrThrow({
        where: { id: ctx.token.uid },
      })
      if (user.role !== UserRole.ADMIN) {
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

      return prisma.user.update({
        where: { id: input.userId },
        data: { role: UserRole.READER },
      })
    }),

  accountsByUser: publicProcedure.query(({ ctx }) => {
    return prisma.account.findMany({
      where: { userId: ctx.token.uid },
    })
  }),

  linkWallet: publicProcedure
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

      const account = await prisma.account.findFirst({
        where: { providerAccountId: input.address },
      })

      if (account) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'This address already linked',
        })
      }

      await prisma.account.create({
        data: {
          userId: ctx.token.uid,
          providerType: ProviderType.WALLET,
          providerAccountId: input.address,
        },
      })
    }),

  disconnectAccount: publicProcedure
    .input(
      z.object({
        accountId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const accounts = await prisma.account.findMany({
        where: { userId: ctx.token.uid },
      })

      if (accounts.length === 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot disconnect the last account',
        })
      }

      const account = accounts.find((a) => a.id === input.accountId)

      if (account && account.providerType === ProviderType.GOOGLE) {
        await prisma.user.update({
          where: { id: ctx.token.uid },
          data: {
            email: null,
          },
        })
      }

      await prisma.account.delete({
        where: { id: input.accountId },
      })
      return true
    }),

  ethPrice: publicProcedure.query(({ ctx }) => {
    return getEthPrice()
  }),
})
