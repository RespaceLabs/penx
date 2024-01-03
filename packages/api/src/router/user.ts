import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { GithubInfo } from '@penx/model'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({ orderBy: { id: 'desc' } })
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      })

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

  sseToken: protectedProcedure.query(async ({ ctx, input }) => {
    return jwt.sign({ sub: ctx.token.uid }, process.env.NEXTAUTH_SECRET!, {
      expiresIn: '30 days',
    })
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

  create: publicProcedure
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

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.user.delete({ where: { id: input } })
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
        data: { github: github },
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
        data: { github: JSON.stringify(github) },
      })
    }),
})
