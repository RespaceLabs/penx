import React, { createContext, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { useAtom } from 'jotai'
import { db } from '@penx/local-db'
import { INode, ISpace } from '@penx/model-types'
import { spacesAtom } from '@penx/store'
import { trpc } from '@penx/trpc-client'
import { DashboardContent } from './DashboardContent'
import { SpacesRender } from './SpacesRender'

async function loadCloudSpaces(): Promise<ISpace[] | undefined> {
  try {
    const remoteSpaces = await trpc.space.mySpaces.query()

    if (!remoteSpaces?.length) return

    const result = await trpc.space.mySpacesWithNodes.query()

    for (const space of result.spaces) {
      await db.createSpace(space as any, false)
    }

    for (const node of result.nodes) {
      await db.createNode(node as any)
    }

    return await db.listSpaces()
  } catch (error) {
  } finally {
  }
}

interface SpacesContextProps {
  spaceNodes: INode[]
  setSpaceNodes: React.Dispatch<React.SetStateAction<INode[]>>
}

export const SpacesContext = createContext<SpacesContextProps>({
  spaceNodes: [],
  setSpaceNodes: () => {},
})

export function Dashboard({ userId }: { userId: string }) {
  const [spaces, setSpaces] = useAtom(spacesAtom)
  const [spaceNodes, setSpaceNodes] = useState<INode[]>([])

  async function loadSpaces(userId: string) {
    if (!db.database.connection) {
      await db.database.connect()
    }
    let spaces = await db.listSpaces(userId)
    if (!spaces?.length) {
      const cloudSpaces = await loadCloudSpaces()
      if (cloudSpaces?.length) {
        spaces = cloudSpaces
      }
    } else {
      const newNodes = await db.listNodesBySpaceId(spaces[0].id)
      setSpaceNodes(newNodes.length ? newNodes : [])
    }

    setSpaces(spaces)
  }

  useEffect(() => {
    loadSpaces(userId)
  }, [userId])

  return (
    <Box flex toCenterX h="100vh">
      <SpacesContext.Provider value={{ spaceNodes, setSpaceNodes }}>
        <Box
          w="256px"
          minH="100%"
          h="auto"
          boxSizing="border-box"
          borderRight-1
        >
          <Box h="40px" toCenter borderBottom-1 borderGray300>
            <h4>Dashboard</h4>
          </Box>
          <Box pl="10px" py="10px" gray600>
            Spaces:
          </Box>

          <SpacesRender spaces={spaces} />
        </Box>

        <DashboardContent />
      </SpacesContext.Provider>
    </Box>
  )
}
