import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { NodeQueryElement } from '../types'
import { DatabaseProvider } from './DatabaseContext'

export const NodeQuery = ({
  attributes,
  element,
  children,
}: ElementProps<NodeQueryElement>) => {
  const { databaseId } = element

  return (
    <Box flex-1 mb8 mt8 contentEditable={false} {...attributes}>
      <Box>Node Query</Box>
      {children}
    </Box>
  )
}
