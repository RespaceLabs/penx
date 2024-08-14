import { prisma } from '@/lib/prisma'
import { Message } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const messageRouter = router({
  listByChannelId: publicProcedure
    .input(
      z.object({
        channelId: z.string(),
        page: z.number().int().positive().default(1),
      }),
    )
    .mutation(async ({ input }) => {
      return {
        messages: [] as (Message & {
          user: {
            name: string | null
            ensName: string | null
            email: string | null
            address: string
          }
        })[],

        currentPage: 1,
        pageCount: 1,
        total: 1,
      }
    }),
})
