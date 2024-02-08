import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { createSpace, CreateSpaceInput } from '../service/createSpace'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const spaceRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.space.findMany({ orderBy: { createdAt: 'desc' } })
  }),

  mySpaces: protectedProcedure.query(async ({ ctx }) => {
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
        isActive: true,
        encrypted: true,
        activeNodeIds: true,
        pageSnapshot: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        syncServerId: true,
        syncServer: {
          select: {
            url: true,
            token: true,
          },
        },
      },
    })

    // console.log('==========spaces:', spaces)

    return spaces.map(({ syncServer, ...space }) => {
      let syncServerAccessToken = ''
      if (syncServer?.token) {
        syncServerAccessToken = jwt.sign(
          { sub: ctx.token.uid },
          syncServer?.token as string,
        )
      }
      return {
        ...space,
        syncServerAccessToken,
        syncServerUrl: syncServer?.url as string,
      }
    })
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

  updateSyncServer: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        syncServerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { spaceId, syncServerId } = input
      await ctx.prisma.space.update({
        where: { id: spaceId },
        data: { syncServerId },
      })

      const count = await ctx.prisma.space.count({
        where: { syncServerId },
      })

      await ctx.prisma.syncServer.update({
        where: { id: syncServerId },
        data: { spaceCount: count },
      })
    }),
})
