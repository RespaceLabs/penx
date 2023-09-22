import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { RoleType } from '../constants'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const memberRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.member.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }),

  listBySpaceId: publicProcedure
    .input(z.object({ spaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.member.findMany({
        where: { spaceId: input.spaceId },
        orderBy: { createdAt: 'asc' },
        include: { user: true },
      })
    }),

  byUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.member.findFirst({ where: { userId: input.userId } })
    }),

  updateRoleType: publicProcedure
    .input(
      z.object({
        id: z.string(),
        roleType: z.nativeEnum(RoleType),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.member.update({
        where: { id: input.id },
        data: { roleType: input.roleType },
      })
    }),

  addMember: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        spaceId: z.string(),
        roleType: z.nativeEnum(RoleType),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const exist = await ctx.prisma.member.findFirst({
        where: { userId: input.userId, spaceId: input.spaceId },
      })
      if (exist) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Member is existed',
        })
      }
      return ctx.prisma.member.create({ data: input })
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        spaceId: z.string().optional(),
        title: z.string().optional(),
        content: z.string().min(1).optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.member.update({ where: { id }, data })
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const userId = ctx.token.uid
      const member = await ctx.prisma.member.findFirstOrThrow({ where: { id } })

      if (userId === member.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Can not delete yourself',
        })
      }

      return ctx.prisma.member.delete({ where: { id } })
    }),

  // TODO: need validation
  exit: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.member.delete({ where: { id: input.id } })
    }),
})
