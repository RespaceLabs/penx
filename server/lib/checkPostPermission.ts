import { prisma } from '@/lib/prisma'
import { Post } from '@prisma/client'
import { TRPCError } from '@trpc/server'

export async function checkPostPermission(
  userId: string,
  postOrId: string | Post,
) {
  let post: Post
  if (typeof postOrId === 'string') {
    post = await prisma.post.findUniqueOrThrow({
      where: { id: postOrId },
    })
  } else {
    post = postOrId
  }

  if (post.userId !== userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No permission to access resource',
    })
  }
}
