import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createSpace, CreateSpaceInput } from '../service/createSpace'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const spaceRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.space.findMany({ orderBy: { createdAt: 'desc' } })
  }),

  mySpaces: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.space.findMany({
      where: { userId: ctx.token.uid },
      orderBy: { createdAt: 'desc' },
    })
  }),

  version: publicProcedure
    .input(z.object({ spaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const space = await ctx.prisma.space.findUnique({
        where: { id: input.spaceId },
      })
      const version: number = (space?.hash as any)?.version || 0
      return version
    }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.space.findUniqueOrThrow({
        where: { id: input.id },
      })
    }),

  create: publicProcedure.input(CreateSpaceInput).mutation(({ ctx, input }) => {
    return createSpace(input)
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        subdomain: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        catalogue: z.string().min(1).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.space.update({ where: { id }, data })
    }),

  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.space.delete({ where: { id: input } })
  }),

  getSnapshot: publicProcedure
    .input(
      z.object({
        spaceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { spaceId } = input
      const space = await ctx.prisma.space.findFirstOrThrow({
        where: { id: spaceId },
      })

      if (!(space.snapshot as any)?.pageMap) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Snapshot not found',
        })
      }

      return {
        version: !(space.snapshot as any).version as any as number,
        nodeMap: !(space.snapshot as any).nodeMap as any as Record<
          string,
          string
        >,
      }
    }),

  upsertSnapshot: publicProcedure
    .input(
      z.object({
        spaceId: z.string(),
        version: z.number(),
        nodeMap: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { spaceId, version, nodeMap } = input
      return ctx.prisma.space.update({
        where: { id: spaceId },
        data: {
          snapshot: {
            version,
            nodeMap: JSON.parse(nodeMap),
          },
        },
      })
    }),
})
