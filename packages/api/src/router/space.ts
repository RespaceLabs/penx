import Redis from 'ioredis'
import { z } from 'zod'
import { RedisKeys } from '@penx/constants'
import { createSpace, CreateSpaceInput } from '../libs/createSpace'
import { createTRPCRouter, protectedProcedure } from '../trpc'

const redis = new Redis(process.env.REDIS_URL!)

type MySpace = {
  id: string
  name: string
  description: string
  editorMode: string
  sort: number
  color: string
  activeNodeIds: string[]
  pageSnapshot: any
  createdAt: Date
  updatedAt: Date
  userId: string
}

export const spaceRouter = createTRPCRouter({
  mySpaces: protectedProcedure.query(async ({ ctx }) => {
    const redisKey = RedisKeys.mySpaces(ctx.token.uid)
    const mySpacesStr = await redis.get(redisKey)

    if (mySpacesStr) {
      return JSON.parse(mySpacesStr) as MySpace[]
    }

    const spaces = await ctx.prisma.space.findMany({
      where: { userId: ctx.token.uid },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        editorMode: true,
        sort: true,
        color: true,
        activeNodeIds: true,
        pageSnapshot: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    })

    // console.log('==========spaces:', spaces)

    return spaces as any as MySpace[]
  }),

  version: protectedProcedure
    .input(z.object({ spaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const space = await ctx.prisma.space.findUnique({
        where: { id: input.spaceId },
      })
      const version: number = (space?.nodeSnapshot as any)?.version || 0
      return version
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.space.findUniqueOrThrow({
        where: { id: input.id },
      })
    }),

  create: protectedProcedure
    .input(CreateSpaceInput)
    .mutation(({ ctx, input }) => {
      return createSpace(input, ctx.token.uid)
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        subdomain: z.string().optional(),
        description: z.string().optional(),
        catalogue: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.space.update({ where: { id }, data })
    }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.space.delete({ where: { id: input } })
    }),
})
