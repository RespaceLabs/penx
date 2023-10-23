import { Box } from '@fower/react'
import { Node } from 'slate'
import { ElementProps } from '@penx/extension-typings'

export const Title = ({
  element,
  attributes,
  children,
  nodeProps,
}: ElementProps) => {
  const str = Node.string(element)
  const isPlaceholderShow = !str?.length
  return (
    <Box
      as="h1"
      pl5
      text4XL
      fontSemibold
      gray900
      relative
      {...attributes}
      {...nodeProps}
      className="page-title"
      css={{
        '::before': {
          content: `"Untitled"`,
          gray200: true,
          breakNormal: true,
          display: isPlaceholderShow ? 'block' : 'none',
          absolute: true,
          top: '50%',
          transform: 'translate(0, -50%)',
          whiteSpace: 'nowrap',
          cursorText: true,
        },
      }}
    >
      {children}
    </Box>
  )
}
