import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { PENX_101_CLOUD_NAME } from '@penx/constants'
import { prisma } from '@penx/db'
import { INode, ISpace } from '@penx/model-types'
import { uniqueId } from '@penx/unique-id'

export const CreateSpaceInput = z.object({
  userId: z.string().min(1),
  spaceData: z.string(),
  encrypted: z.boolean(),
  nodesData: z.string().optional(),
})

export type CreateUserInput = z.infer<typeof CreateSpaceInput>

export function createSpace(input: CreateUserInput) {
  const { userId, spaceData, nodesData } = input
  const space: ISpace = JSON.parse(spaceData)
  const nodes: INode[] = JSON.parse(nodesData || '[]')

  if (space.name === PENX_101_CLOUD_NAME) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'This is a reserved name. Please choose another one.',
    })
  }

  return prisma.$transaction(
    async (tx) => {
      await tx.space.create({
        data: {
          id: space.id,
          subdomain: uniqueId(),
          userId,
          name: space.name,
          color: space.color,
          isActive: space.isActive,
          encrypted: space.encrypted,
          activeNodeIds: space.activeNodeIds || [],
          nodeSnapshot: space.nodeSnapshot,
          pageSnapshot: space.pageSnapshot,
        },
      })

      await tx.node.createMany({
        data: nodes.map((node) => {
          const { openedAt, createdAt, updatedAt, ...rest } = node
          return { ...rest }
        }),
      })

      return space
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}
