import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RouterOutputs } from '@penx/api'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { INode, ISpace } from '@penx/model-types'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

interface Props {
  userId: string
}

type Space = RouterOutputs['space']['all'][0]

export const QueryCloudSpaces = ({ userId }: Props) => {
  const { data } = useQuery(['spaces'], () => trpc.space.mySpaces.query())

  const initSpaces = async (spaces: Space[]) => {
    // console.log('=========xxxspaces::', spaces)

    for (const space of spaces) {
      await db.createSpaceByRemote({
        ...space,
        isActive: false,
        isCloud: true,
      } as any as ISpace)

      // only create nodes if the space is not encrypted
      if (!space.encrypted) {
        const nodes = await trpc.node.listBySpaceId.query({ spaceId: space.id })
        for (const item of nodes) {
          await db.createNode(item as any as INode)
        }
      }
    }

    const newSpaces = await db.listSpaces()
    store.setSpaces(newSpaces)
  }

  useEffect(() => {
    if (!data) return
    const spaces = store.getSpaces()

    const newSpaces = data.filter(
      (space) => !spaces.map((i) => i.id).includes(space.id),
    )

    initSpaces(newSpaces)
  }, [data])

  return null
}
