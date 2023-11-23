import { nanoid } from 'nanoid'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { INode, ISpace } from '@penx/model-types'
import { RoleType } from '../constants'

export const CreateSpaceInput = z.object({
  userId: z.string().min(1),
  spaceData: z.string(),
  nodesData: z.string().optional(),
})

export type CreateUserInput = z.infer<typeof CreateSpaceInput>

export function createSpace(input: CreateUserInput) {
  const { userId, spaceData, nodesData } = input
  const space: ISpace = JSON.parse(spaceData)
  const nodes: INode[] = JSON.parse(nodesData || '[]')

  console.log('========nodes:', nodes)

  return prisma.$transaction(
    async (tx) => {
      await tx.space.create({
        data: {
          id: space.id,
          subdomain: nanoid(),
          userId,
          name: space.name,
          color: space.color,
          isActive: space.isActive,
          activeNodeIds: space.activeNodeIds || [],
          snapshot: space.snapshot,
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
