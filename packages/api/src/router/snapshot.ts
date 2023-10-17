import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const snapshotRouter = createTRPCRouter({
  getByRepo: publicProcedure
    .input(
      z.object({
        repo: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.snapshot.findFirstOrThrow({
        where: { repo: input.repo },
      })
    }),

  upsert: publicProcedure
    .input(
      z.object({
        repo: z.string(),
        spaceId: z.string(),
        version: z.number(),
        hashMap: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const find = await ctx.prisma.snapshot.findUnique({
        where: { spaceId: input.spaceId },
      })

      if (!find) {
        return await ctx.prisma.snapshot.create({
          data: input,
        })
      }

      return ctx.prisma.snapshot.update({
        where: { id: find.id },
        data: input,
      })
    }),
})
