import React, { useContext } from 'react'
import { Box } from '@fower/react'
import { ISpace } from '@penx/model-types'
import { SpacesContext } from '.'
import { DashboardFilter } from './dashboardFilter'
import { DashboardTable } from './dashboardTable'

export function DashboardContent({ activeSpace }: { activeSpace: ISpace }) {
  const { spaceNodes, filtersDb } = useContext(SpacesContext)

  if (!activeSpace?.id) return null

  return (
    <Box h="100%" flexGrow={1} boxSizing="border-box" pt="40px">
      {spaceNodes.length || filtersDb.length ? (
        <>
          <Box toCenterY gap1>
            <DashboardFilter />
          </Box>

          <DashboardTable spaceNodes={spaceNodes} />
        </>
      ) : (
        <Box>No space data yet</Box>
      )}
    </Box>
  )
}
