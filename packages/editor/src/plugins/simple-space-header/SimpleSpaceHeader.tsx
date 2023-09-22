import { Box } from '@fower/react'
import Link from 'next/link'
import { useFocused, useSelected } from 'slate-react'
import { ElementProps, SimpleSpaceHeaderElement } from '@penx/editor-types'
import { useEditorContext } from '../../components/EditorProvider'

export const SimpleSpaceHeader = ({
  attributes,
  element,
  nodeProps,
  children,
  atomicProps,
}: ElementProps<SimpleSpaceHeaderElement>) => {
  const { space } = useEditorContext()

  return (
    <Box {...attributes} {...nodeProps}>
      <Box
        contentEditable={false}
        toBetween
        py2
        mx-auto
        w={element.width}
        {...atomicProps}
      >
        <Link href="/">
          <Box text2XL fontBold>
            {space?.name}
          </Box>
        </Link>
        <Box toCenterY gapX2>
          <Link href="/posts">
            <Box>Posts</Box>
          </Link>

          <Link href="/about">
            <Box>About</Box>
          </Link>
        </Box>
      </Box>
      {children}
    </Box>
  )
}
