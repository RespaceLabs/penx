import React, { createContext, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { useAtom } from 'jotai'
import { db } from '@penx/local-db'
import { INode, ISpace } from '@penx/model-types'
import { spacesAtom } from '@penx/store'
import { api } from '@penx/trpc-client'
import { DashboardContent } from './DashboardContent'
import { SpacesRender } from './SpacesRender'

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

    const newNodes = await db.listNodesBySpaceId(spaces[0].id)
    setSpaceNodes(newNodes.length ? newNodes : [])
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
