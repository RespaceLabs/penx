import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { NodeElement } from '../types'

export const NodeComponent = ({
  attributes,
  nodeProps,
  element,
  children,
}: ElementProps<NodeElement>) => {
  console.log('element-----:', element, 'children:', children)
  return (
    <Box
      py1
      leadingNormal
      gray900
      textBase
      relative
      pl6
      // toCenterY
      gap2
      {...attributes}
      {...nodeProps}
    >
      <Box toLeft gap2>
        <Box contentEditable={false} h-1em toCenterY>
          <Box className="bullet" square-6 bgGray300 roundedFull />
        </Box>
        <Box>{children}</Box>
      </Box>
    </Box>
  )
}
