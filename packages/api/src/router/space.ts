import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createSpace, CreateSpaceInput } from '../service/createSpace'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const spaceRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.space.findMany({ orderBy: { createdAt: 'desc' } })
  }),

  mySpaces: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.space.findMany({
      where: { userId: ctx.token.uid },
      orderBy: { createdAt: 'desc' },
    })
  }),

  mySpacesWithNodes: protectedProcedure.query(async ({ ctx }) => {
    const spaces = await ctx.prisma.space.findMany({
      where: { userId: ctx.token.uid },
      orderBy: { createdAt: 'desc' },
    })
    const spaceIds = spaces.map((space) => space.id)
    const nodes = await ctx.prisma.node.findMany({
      where: { spaceId: { in: spaceIds } },
    })
    return { spaces, nodes }
  }),

  lastModifiedTime: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const node = await ctx.prisma.node.findFirst({
        where: {
          spaceId: input.spaceId,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 1,
      })

      if (!node) return null
      return node.updatedAt
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
      return createSpace(input)
    }),

  update: protectedProcedure
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

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        await tx.node.deleteMany({ where: { spaceId: input } })
        return ctx.prisma.space.delete({ where: { id: input } })
      })
    }),

  getPageSnapshot: protectedProcedure
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

      if (!(space.pageSnapshot as any)?.pageMap) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Snapshot not found',
        })
      }

      return {
        version: (space.pageSnapshot as any).version as any as number,
        pageMap: (space.pageSnapshot as any).pageMap as any as Record<
          string,
          string
        >,
      }
    }),

  upsertPageSnapshot: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        version: z.number(),
        pageMap: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { spaceId, version, pageMap } = input
      return ctx.prisma.space.update({
        where: { id: spaceId },
        data: {
          pageSnapshot: {
            version,
            pageMap: JSON.parse(pageMap),
          },
        },
      })
    }),
})
