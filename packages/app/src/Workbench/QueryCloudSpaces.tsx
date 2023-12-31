import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RouterOutputs } from '@penx/api'
import { PENX_101, PENX_101_CLOUD_NAME } from '@penx/constants'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode, ISpace } from '@penx/model-types'
import { store } from '@penx/store'
import { getNodeMap } from '@penx/sync'
import { trpc } from '@penx/trpc-client'

interface Props {
  userId: string
}

type Space = RouterOutputs['space']['all'][0]

export const QueryCloudSpaces = () => {
  const { data } = useQuery(['spaces'], () => trpc.space.mySpaces.query())

  const initSpaces = async (spaces: Space[]) => {
    for (const space of spaces) {
      const newSpace = await db.createSpaceByRemote({
        ...space,
        isActive: false,
      } as any as ISpace)

      // only create nodes if the space is not encrypted
      if (!space.encrypted) {
        const nodes = await trpc.node.listBySpaceId.query({ spaceId: space.id })

        for (const item of nodes) {
          await db.createNode(item as any as INode)
        }

        if (nodes.length) {
          const newNodes = await db.listNodesBySpaceId(space.id)

          // update nodeMap in snapshot
          await db.updateSpace(space.id, {
            nodeSnapshot: {
              ...newSpace.nodeSnapshot,
              nodeMap: getNodeMap(newNodes),
            },
          })
        }
      }
    }

    const newSpaces = await db.listSpaces()
    store.space.setSpaces(newSpaces)
  }

  useEffect(() => {
    if (!data) return
    const spaces = store.space.getSpaces()

    const newSpaces = data.filter(
      (space) => !spaces.map((i) => i.id).includes(space.id),
    )

    initSpaces(newSpaces)
  }, [data])

  return null
}
