import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { SyncServerType } from '@penx/constants'
import { prisma } from '@penx/db'
import { ISpace } from '@penx/model-types'
import { uniqueId } from '@penx/unique-id'

export const CreateSpaceInput = z.object({
  userId: z.string().min(1),
  spaceData: z.string(),
})

export type CreateUserInput = z.infer<typeof CreateSpaceInput>

export function createSpace(input: CreateUserInput) {
  const { userId, spaceData } = input
  const space: ISpace = JSON.parse(spaceData)

  return prisma.$transaction(
    async (tx) => {
      const syncServer = await tx.syncServer.findFirst({
        where: {
          type: SyncServerType.OFFICIAL,
          url: { not: '' },
        },
        orderBy: { createdAt: 'desc' },
      })

      if (!syncServer) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Sync server not found.',
        })
      }

      const syncServerAccessToken = jwt.sign({ sub: userId }, syncServer.token)

      const newSpace = await tx.space.create({
        data: {
          id: space.id,
          subdomain: uniqueId(),
          userId,
          editorMode: space.editorMode,
          name: space.name,
          color: space.color,
          isActive: space.isActive,
          activeNodeIds: space.activeNodeIds || [],
          syncServerId: syncServer.id,
          nodeSnapshot: space.nodeSnapshot,
          pageSnapshot: space.pageSnapshot,
        },
      })

      const count = await tx.space.count({
        where: { syncServerId: syncServer.id },
      })

      await tx.syncServer.update({
        where: { id: syncServer.id },
        data: { spaceCount: count },
      })

      return {
        ...newSpace,
        syncServerAccessToken,
        syncServerUrl: syncServer.url,
      }
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}
