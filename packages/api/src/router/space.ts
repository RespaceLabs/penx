import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createSpace, CreateUserInput } from '../service/createSpace'
import { getAuthApp } from '../service/getAuthApp'
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

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.space.findUnique({
        where: {
          id: input.id,
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      })
    }),

  create: publicProcedure.input(CreateUserInput).mutation(({ ctx, input }) => {
    return createSpace(input)
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        subdomain: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        isPrivate: z.boolean().optional(),
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
})
