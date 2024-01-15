import React, { useContext } from 'react'
import { Box } from '@fower/react'
import { SpacesContext } from '.'
import { DashboardTable } from './dashboardTable'

export function DashboardContent() {
  const { spaceNodes } = useContext(SpacesContext)

  return (
    <Box h="100%" flexGrow={1} boxSizing="border-box" pt="40px">
      {spaceNodes.length ? (
        <DashboardTable spaceNodes={spaceNodes} />
      ) : (
        <Box>No space data yet</Box>
      )}
    </Box>
  )
}
