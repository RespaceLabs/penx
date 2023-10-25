import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { GithubInfo } from '@penx/model'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const userRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({ orderBy: { id: 'desc' } })
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      })

      if (!user) new TRPCError({ code: 'NOT_FOUND' })
      const { createdAt, ...rest } = user!

      return rest
    }),

  byAddress: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: { address: input.address },
      })

      return user
    }),

  search: publicProcedure
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

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        address: z.string(),
        displayName: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        avatarURL: z.string().min(1).optional(),
        coverURL: z.string().min(1).optional(),
        color: z.string().min(1).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.user.update({ where: { id }, data })
    }),

  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.user.delete({ where: { id: input } })
  }),

  connectRepo: publicProcedure
    .input(
      z.object({
        address: z.string(),
        repo: z.string(),
        installationId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { address } = input
      const user = await ctx.prisma.user.findFirstOrThrow({
        where: { address },
      })

      const github: GithubInfo = JSON.parse(user.github || '{}')

      github.installationId = input.installationId
      github.repo = input.repo

      return ctx.prisma.user.update({
        where: { address },
        data: { github: JSON.stringify(github) },
      })
    }),

  disconnectRepo: publicProcedure
    .input(z.object({ address: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { address } = input
      const user = await ctx.prisma.user.findFirstOrThrow({
        where: { address: input.address },
      })

      const github: GithubInfo = JSON.parse(user.github || '{}')

      github.installationId = null as any
      github.repo = ''

      return ctx.prisma.user.update({
        where: { address },
        data: { github: JSON.stringify(github) },
      })
    }),
})
