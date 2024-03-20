import React, { createContext, useCallback, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { useAtom } from 'jotai'
import { db } from '@penx/local-db'
import { Filter, INode, ISpace } from '@penx/model-types'
import { spacesAtom } from '@penx/store'
import { DashboardContent } from './DashboardContent'
import { SpacesRender } from './SpacesRender'

export interface DashboardViewColumn {
  name: string
  fieldType: string
}

interface SpacesContextProps {
  spaceNodes: INode[]
  setSpaceNodes: React.Dispatch<React.SetStateAction<INode[]>>
  activeSpace: ISpace
  setActiveSpace: React.Dispatch<React.SetStateAction<ISpace>>
  viewColumns: DashboardViewColumn[]
  setViewColumns: React.Dispatch<React.SetStateAction<DashboardViewColumn[]>>
  filtersDb: Filter[]
  setFiltersDb: React.Dispatch<React.SetStateAction<Filter[]>>
}

export const SpacesContext = createContext<SpacesContextProps>({
  spaceNodes: [],
  setSpaceNodes: () => {},
  activeSpace: {} as ISpace,
  setActiveSpace: () => {},
  viewColumns: [],
  setViewColumns: () => {},
  filtersDb: [],
  setFiltersDb: () => {},
})

export function Dashboard({ userId }: { userId: string }) {
  const [spaces, setSpaces] = useAtom(spacesAtom)
  const [spaceNodes, setSpaceNodes] = useState<INode[]>([])
  const [viewColumns, setViewColumns] = useState<DashboardViewColumn[]>([])
  const [activeSpace, setActiveSpace] = useState<ISpace>(
    null as unknown as ISpace,
  )
  const [filtersDb, setFiltersDb] = useState<Filter[]>([])

  async function loadSpaces(userId: string) {
    const spaces = await db.listSpaces(userId)

    if (spaces.length) {
      const newNodes = await db.listNodesBySpaceId(spaces[0].id)
      setSpaceNodes(newNodes.length ? newNodes : [])
      generateSortedColumns(newNodes)
      setSpaces(spaces)
    }
  }

  const generateSortedColumns = useCallback(
    (sNodes: INode[]) => {
      const spaceNode = sNodes[0]
      const columns: DashboardViewColumn[] = []
      for (const key in spaceNode) {
        if (spaceNode.hasOwnProperty(key)) {
          const column = {
            name: key,
            fieldType: key,
          }

          columns.push(column)
        }
      }

      setViewColumns(columns)
    },
    [spaceNodes],
  )

  useEffect(() => {
    loadSpaces(userId)
  }, [userId])

  return (
    <Box flex toCenterX h="100vh">
      <SpacesContext.Provider
        value={{
          spaceNodes,
          setSpaceNodes,
          activeSpace,
          setActiveSpace,
          viewColumns,
          setViewColumns,
          filtersDb,
          setFiltersDb,
        }}
      >
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

        <DashboardContent activeSpace={activeSpace} />
      </SpacesContext.Provider>
    </Box>
  )
}
