import { Post } from '@prisma/client'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const postRouter = router({
  list: publicProcedure.query(async ({ ctx, input }) => {
    return [] as Post[]
  }),

  listBySpaceId: protectedProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return [] as Post[]
    }),

  byId: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return {} as Post & {
      space: {
        subdomain: string
        userId: string
      }
    }
  }),

  create: protectedProcedure
    .input(
      z.object({
        spaceId: z.string(),
        title: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return {} as Post & {
        space: {
          subdomain: string
          userId: string
        }
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),

  updateCover: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),

  publish: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        creationId: z.string(),
        gateType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),
})
