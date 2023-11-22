import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { prisma } from '@penx/db'
import { INode, ISpace } from '@penx/model-types'

export const syncNodesInput = z.object({
  version: z.number(),
  spaceId: z.string(),
  added: z.string(),
  updated: z.string(),
  deleted: z.string(),
})

export type SyncUserInput = z.infer<typeof syncNodesInput>

export function syncNodes(input: SyncUserInput) {
  const added: INode[] = JSON.parse(input.added)
  const updated: INode[] = JSON.parse(input.updated)
  const deleted: string[] = JSON.parse(input.deleted)
  // console.log('added:', added)
  // console.log('updated:', updated)
  // console.log('deleted:', deleted)

  return prisma.$transaction(
    async (tx) => {
      const space = await tx.space.findUniqueOrThrow({
        where: { id: input.spaceId },
      })

      console.log(
        'input.version:',
        input.version,
        'space.version:',
        space.version,
      )

      if (input.version < space.version) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Version invalid',
        })
      }

      // TODO: need to improve this
      for (const item of added) {
        const node = await tx.node.findUnique({ where: { id: item.id } })
        const { openedAt, createdAt, updatedAt, ...rest } = item
        if (node) {
          await tx.node.update({
            where: { id: item.id },
            data: {
              ...rest,
              openedAt: new Date(openedAt),
            },
          })
        } else {
          await tx.node.create({ data: rest })
        }
      }

      for (const item of updated) {
        const { openedAt, createdAt, updatedAt, ...rest } = item

        try {
          await tx.node.update({
            where: { id: item.id },
            data: {
              ...rest,
              openedAt: new Date(openedAt),
            },
          })
        } catch (error) {}
      }

      for (const id of deleted) {
        try {
          await tx.node.delete({
            where: { id: id },
          })
        } catch (error) {}
      }

      const newVersion = space.version + 1
      await tx.space.update({
        where: { id: input.spaceId },
        data: { version: newVersion },
      })

      return newVersion
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  )
}
