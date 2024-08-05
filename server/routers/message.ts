import { prisma } from '@/lib/prisma'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const messageRouter = router({
  getMsgsByChannelId: publicProcedure
    .input(
      z.object({
        channelId: z.string(),
        page: z.number().int().positive().default(1),
      }),
    )
    .mutation(async ({ input }) => {
      const { channelId, page } = input

      try {
        const [messages, pageInfo] = await prisma.message
          .paginate({
            where: { channelId },
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              status: true,
              chat_send_or_receive: true,
              fromId: true,
              toId: true,
              contentType: true,
              content: true,
              spaceId: true,
              channelId: true,
              createdAt: true,
              fromUser: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          })
          .withPages({ limit: 20, page, includePageCount: true })

        return {
          messages,
          currentPage: pageInfo.currentPage,
          pageCount: pageInfo.pageCount,
          total: pageInfo.totalCount,
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred, please try again later.',
          cause: error,
        })
      }
    }),
})
