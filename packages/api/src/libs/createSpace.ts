import { z } from 'zod'
import { prisma } from '@penx/db'
import { ISpace } from '@penx/model-types'
import { uniqueId } from '@penx/unique-id'

export const CreateSpaceInput = z.object({
  spaceData: z.string(),
})

export type CreateUserInput = z.infer<typeof CreateSpaceInput>

export function createSpace(input: CreateUserInput, userId: string) {
  const { spaceData } = input
  const space: ISpace = JSON.parse(spaceData)

  return prisma.$transaction(
    async (tx) => {
      const newSpace = await tx.space.create({
        data: {
          id: space.id,
          subdomain: uniqueId(),
          userId,
          editorMode: space.editorMode,
          name: space.name,
          color: space.color,
          activeNodeIds: space.activeNodeIds || [],
          nodeSnapshot: space.nodeSnapshot,
          pageSnapshot: space.pageSnapshot,
        },
      })

      return newSpace
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}
