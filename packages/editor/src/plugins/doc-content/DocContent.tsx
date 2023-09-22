import { Tag } from '@bone-ui/tag'
import { Box } from '@fower/react'
import { format } from 'date-fns'
import { useFocused, useSelected } from 'slate-react'
import { Avatar } from 'uikit'
import { DocContentElement, ElementProps } from '@penx/editor-types'
import { useEditorContext } from '../../components/EditorProvider'
import { ReadOnlyEditor } from '../../components/ReadOnlyEditor'
import { docPluginList } from '../../docPluginList'

export const DocContent = ({
  attributes,
  children,
  nodeProps,
  atomicProps,
}: ElementProps<DocContentElement>) => {
  const selected = useSelected()
  const focused = useFocused()
  const active = selected && focused
  const { doc, isDesign } = useEditorContext()

  if (isDesign || !doc) {
    return (
      <Box {...attributes} {...nodeProps} border={active}>
        <Box contentEditable={false} bgGray100 minH-200 toCenter>
          Doc content
        </Box>
        {children}
      </Box>
    )
  }

  return (
    <Box {...attributes} {...nodeProps}>
      <Box
        contentEditable={false}
        mx-auto
        textBase
        px={[20, 20, 20, 0]}
        {...atomicProps}
      >
        <Box as="h1" text5XL fontBold mt0 mb4>
          {doc?.title}
        </Box>
        <Box toCenterY mb10 gapX3 gray500>
          <Avatar name="f" size="sm" />
          <Box textBase gray800>
            Someone
          </Box>
          <Tag variant="light" colorScheme="gray500">
            0x808a
          </Tag>

          <Tag variant="light" colorScheme="gray500">
            {format(new Date(doc.createdAt), 'yyyy-MM-dd')}
          </Tag>
        </Box>

        <ReadOnlyEditor
          plugins={docPluginList}
          content={JSON.parse(doc.content)}
        />
      </Box>

      {children}
    </Box>
  )
}
