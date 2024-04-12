import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const syncServerRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.syncServer.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        region: true,
        type: true,
      },
    })
  }),

  runningSyncServers: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.syncServer.findMany({
      where: {
        OR: [
          {
            type: 'OFFICIAL',
            url: { not: '' },
          },
          {
            type: 'PUBLIC',
            url: { not: '' },
          },
          {
            userId: ctx.token.uid,
            type: 'PRIVATE',
            url: { not: '' },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        region: true,
        type: true,
      },
    })
  }),

  mySyncServers: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.syncServer.findMany({
      where: { userId: ctx.token.uid },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        token: true,
        region: true,
        type: true,
      },
    })
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(({ ctx, input }) => {
      return ctx.prisma.syncServer.findUniqueOrThrow({
        where: { id: input.id },
        select: {
          id: true,
          url: true,
        },
      })
    }),

  accessToken: protectedProcedure
    .input(
      z.object({
        syncServerId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const syncServer = await ctx.prisma.syncServer.findFirstOrThrow({
        where: { id: input.syncServerId },
      })

      // TODO: handle expiresIn
      return jwt.sign({ sub: ctx.token.uid }, syncServer.token!)

      // return jwt.sign({ sub: ctx.token.uid }, process.env.NEXTAUTH_SECRET!, {
      //   expiresIn: '30 days',
      // })
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.syncServer.create({
        data: {
          token: nanoid(),
          url: '',
          ...input,
          userId: ctx.token.uid,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1).optional(),
        url: z.string().optional(),
        type: z.string().min(1).optional(),
        region: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.syncServer.update({ where: { id }, data })
    }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.syncServer.delete({ where: { id: input } })
    }),
})
