import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { TableRowElement } from '../types'

export const TableRow = (props: ElementProps<TableRowElement>) => {
  return (
    <Box
      as="tr"
      className="tableRow"
      outlineNone
      bgWhite
      relative
      {...props.attributes}
    >
      {props.children}
    </Box>
  )
}
