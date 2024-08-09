import { Member, Space } from '@prisma/client'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const spaceRouter = router({
  mySpaces: protectedProcedure.query(async ({ ctx }) => {
    return [] as Space[]
  }),

  discoverSpaces: publicProcedure.query(async () => {
    return [] as (Space & {
      members: (Member & {
        user: {
          ensName: string | null
          address: string
        }
      })[]
    })[]
  }),

  byId: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return {} as Space
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        subdomain: z.string(),
        creationId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return {} as Space
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        subdomain: z.string().optional(),
        logo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),

  enableSponsor: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        creationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return true
    }),
})
