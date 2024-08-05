import { prisma } from '@/lib/prisma'
import { Channel, Post } from '@prisma/client'
import { TRPCError } from '@trpc/server'

export async function checkChannelPermission(
  userId: string,
  channelId: string,
) {
  const channel = await prisma.channel.findUniqueOrThrow({
    where: { id: channelId },
    include: {
      space: {
        select: {
          userId: true,
        },
      },
    },
  })

  if (channel.space.userId !== userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No permission to access resource',
    })
  }
}
