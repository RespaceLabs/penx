import { Box } from '@fower/react'
import { Input } from 'uikit'
import { ElementProps } from '@penx/extension-typings'
import { LiveQueryElement } from '../../types'
import { LiveQueryProvider } from './LiveQueryContext'

export const LiveQuery = ({
  attributes,
  element,
  children,
}: ElementProps<LiveQueryElement>) => {
  const sql = '#bookmark'
  return (
    <Box flex-1 mb8 mt8 contentEditable={false} {...attributes}>
      <Box>
        <Input placeholder="#bookmark" defaultValue="#bookmark" />
      </Box>
      <LiveQueryProvider sql={sql}>
        <Box>Node Query...</Box>
      </LiveQueryProvider>
      {children}
    </Box>
  )
}
