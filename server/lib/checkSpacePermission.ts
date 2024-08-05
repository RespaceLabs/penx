import { prisma } from '@/lib/prisma'
import { Space } from '@prisma/client'
import { TRPCError } from '@trpc/server'

export async function checkSpacePermission(
  userId: string,
  spaceOrId: string | Space,
): Promise<void> {
  let space: Space
  if (typeof spaceOrId === 'string') {
    space = await prisma.space.findUniqueOrThrow({
      where: { id: spaceOrId },
    })
  } else {
    space = spaceOrId
  }

  if (space.userId !== userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No permission to access this resource',
    })
  }
}
