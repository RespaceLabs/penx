import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { TableElement } from '../../types'
import { AddColumnBar } from './AddColumnBar'
import { AddRowBar } from './AddRowBar'
import { DraglineList } from './DraglineList'
import { TableOptions } from './TableOptions'

export const Table = ({
  attributes,
  element,
  children,
}: ElementProps<TableElement>) => {
  return (
    <Box flex-1 mb8 mt8>
      <Box relative inlineBlock>
        <DraglineList element={element} />
        <TableOptions element={element} />
        <Box
          as="table"
          id={`table-${element.id}`}
          relative
          css={{ borderCollapse: 'collapse', border: true }}
        >
          <Box
            as="tbody"
            relative
            {...attributes}
            css={{
              'tr:first-child': {
                '.tableCellHandler': {
                  display: 'block',
                },
              },
            }}
          >
            {children}
          </Box>
        </Box>
        <AddColumnBar element={element} />
        <AddRowBar element={element} />
      </Box>
    </Box>
  )
}
