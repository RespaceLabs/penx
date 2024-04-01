import { TRPCError } from '@trpc/server'
import Redis from 'ioredis'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { RedisKeys } from '@penx/constants'
import { prisma, User } from '@penx/db'
import { GithubInfo } from '@penx/model'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const redisKey = RedisKeys.user(ctx.token.uid)

    const userStr = await redis.get(redisKey)

    if (userStr) {
      return JSON.parse(userStr) as User
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.token.uid },
    })

    await redis.set(redisKey, JSON.stringify(user))

    if (!user) new TRPCError({ code: 'NOT_FOUND' })

    return user!
  }),

  byAddress: protectedProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { address: input.address },
      })

      return user
    }),

  getMySecret: protectedProcedure.query(async ({ ctx, input }) => {
    const { secret } = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.token.uid },
      select: { secret: true },
    })

    if (secret) return secret
    const user = await ctx.prisma.user.update({
      where: { id: ctx.token.uid },
      data: { secret: nanoid() },
    })
    return user.secret!
  }),

  search: protectedProcedure
    .input(z.object({ q: z.string() }))
    .query(async ({ ctx, input }) => {
      let { q } = input
      if (!q) return []
      const users = await ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              email: { contains: q, mode: 'insensitive' },
            },
            { name: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: 5,
      })

      return users
    }),

  selfHostedSignIn: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [username, password] = (
        process.env.SELF_HOSTED_CREDENTIALS as string
      ).split('/')

      if (username === input.username && password === input.password) {
        let user = await ctx.prisma.user.findFirst({
          where: { username, password },
        })

        if (!user) {
          user = await ctx.prisma.user.create({ data: { username, password } })
        }
        return user
      } else {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Snapshot not found',
        })
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        address: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { address } = input
      let user = await ctx.prisma.user.findFirst({ where: { address } })
      if (!user) {
        user = await ctx.prisma.user.create({ data: { address } })
      }
      return user
    }),

  updateAddress: protectedProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { address } = input
      return ctx.prisma.user.update({
        where: { id: ctx.token.uid },
        data: { address },
      })
    }),

  updatePublicKey: protectedProcedure
    .input(
      z.object({
        publicKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { publicKey } = input
      return ctx.prisma.user.update({
        where: { id: ctx.token.uid },
        data: { publicKey },
        select: { publicKey: true, secret: true },
      })
    }),

  loginByPersonalToken: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const token = await ctx.prisma.personalToken.findUnique({
        where: { value: input },
      })
      if (!token) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid personal token',
        })
      }

      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: token.userId },
        select: {
          id: true,
          address: true,
          earlyAccessCode: true,
          publicKey: true,
          secret: true,
          roleType: true,
          name: true,
          avatar: true,
          image: true,
        },
      })

      return {
        token: jwt.sign({ sub: user.id }, process.env.NEXTAUTH_SECRET!, {
          expiresIn: '365d',
        }),
        user,
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        address: z.string(),
        displayName: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        avatarURL: z.string().min(1).optional(),
        color: z.string().min(1).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.user.update({ where: { id }, data })
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx, input }) => {
    const userId = ctx.token.uid
    return prisma.$transaction(
      async (tx) => {
        await tx.space.deleteMany({ where: { userId } })
        await tx.account.deleteMany({ where: { userId } })
        await tx.personalToken.deleteMany({ where: { userId } })
        await tx.syncServer.deleteMany({ where: { userId } })
        await tx.user.delete({ where: { id: userId } })
        return true
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      },
    )
  }),

  connectRepo: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        repo: z.string(),
        installationId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input
      const user = await ctx.prisma.user.findFirstOrThrow({
        where: { id: userId },
      })

      const github = (user.github || {}) as GithubInfo

      github.installationId = input.installationId
      github.repo = input.repo

      return ctx.prisma.user.update({
        where: { id: userId },
        data: { github },
      })
    }),

  disconnectTaskGithub: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.prisma.user.update({
      where: { id: ctx.token.uid },
      data: { taskGithub: {} },
    })
  }),

  disconnectRepo: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input
      const user = await ctx.prisma.user.findFirstOrThrow({
        where: { id: userId },
      })

      const github = (user.github || {}) as GithubInfo

      github.installationId = null as any
      github.repo = ''

      return ctx.prisma.user.update({
        where: { id: userId },
        data: { github },
      })
    }),

  updateMnemonicBackupStatus: protectedProcedure
    .input(z.boolean())
    .mutation(async ({ ctx, input }) => {
      const redisKey = RedisKeys.user(ctx.token.uid)

      const user = await ctx.prisma.user.update({
        where: { id: ctx.token.uid },
        data: { isMnemonicBackedUp: input },
      })

      await redis.set(redisKey, JSON.stringify(user))
      return user
    }),

  isEarlyAccessCodeValid: protectedProcedure
    .input(
      z.object({
        code: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { id: ctx.token.uid, earlyAccessCode: input.code },
      })
      return !!user
    }),
})
