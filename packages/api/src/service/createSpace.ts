import { TRPCError } from '@trpc/server'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { PENX_101_CLOUD_NAME, SyncServerType } from '@penx/constants'
import { prisma } from '@penx/db'
import { INode, ISpace } from '@penx/model-types'
import { uniqueId } from '@penx/unique-id'

export const CreateSpaceInput = z.object({
  userId: z.string().min(1),
  spaceData: z.string(),
  encrypted: z.boolean(),
})

export type CreateUserInput = z.infer<typeof CreateSpaceInput>

export function createSpace(input: CreateUserInput) {
  const { userId, spaceData } = input
  const space: ISpace = JSON.parse(spaceData)

  if (space.name === PENX_101_CLOUD_NAME) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'This is a reserved name. Please choose another one.',
    })
  }

  return prisma.$transaction(
    async (tx) => {
      const syncServer = await tx.syncServer.findFirst({
        where: {
          type: SyncServerType.OFFICIAL,
          url: { not: '' },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      if (!syncServer) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Sync server not found.',
        })
      }

      return await tx.space.create({
        data: {
          id: space.id,
          subdomain: uniqueId(),
          userId,
          editorMode: space.editorMode,
          name: space.name,
          color: space.color,
          isActive: space.isActive,
          encrypted: space.encrypted,
          password: nanoid(),
          activeNodeIds: space.activeNodeIds || [],
          syncServerId: syncServer.id,
          nodeSnapshot: space.nodeSnapshot,
          pageSnapshot: space.pageSnapshot,
        },
      })
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}
