import { useEffect } from 'react'
import { RouterOutputs } from '@penx/api'
import { db } from '@penx/local-db'
import { INode, ISpace } from '@penx/model-types'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

type Space = RouterOutputs['space']['mySpaces'][0]

export const QueryCloudSpaces = () => {
  const { data } = trpc.space.mySpaces.useQuery()

  const initSpaces = async (spaces: Space[]) => {
    for (const space of spaces) {
      await db.createSpaceByRemote({
        ...space,
        isActive: false,
      } as any as ISpace)
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

    initSpaces(newSpaces as any)
  }, [data])

  return null
}
