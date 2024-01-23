import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc'

export const syncServerRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.syncServer.findMany({ orderBy: { createdAt: 'desc' } })
  }),

  byId: publicProcedure
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
    .input(z.object({ spaceId: z.string() }))
    .query(async ({ ctx, input }) => {
      const space = await ctx.prisma.space.findFirstOrThrow({
        where: { id: input.spaceId },
        select: {
          id: true,
          syncServer: { select: { token: true } },
        },
      })

      // TODO: handle expiresIn
      return jwt.sign({ sub: ctx.token.uid }, space.syncServer?.token!)

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
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.syncServer.update({ where: { id }, data })
    }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(async (tx) => {
        await tx.node.deleteMany({ where: { spaceId: input } })
        return ctx.prisma.space.delete({ where: { id: input } })
      })
    }),
})
