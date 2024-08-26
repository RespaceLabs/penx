import { prisma } from '@/lib/prisma'
import { Theme } from '@prisma/client'
import { z } from 'zod'
import { checkSpacePermission } from '../lib/checkSpacePermission'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const themeRouter = router({
  list: publicProcedure.query(async ({ input }) => {
    return [] as Theme[]
  }),

  listBySpaceId: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return [] as Theme[]
    }),

  create: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        name: z.string(),
        displayName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return {} as Theme
    }),

  publish: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        spaceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),
})
