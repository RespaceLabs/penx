import { Box } from '@fower/react'
import { Paperclip } from 'lucide-react'
import { useFocused, useSelected, useSlateStatic } from 'slate-react'
import { ElementProps } from '@penx/extension-typings'
import { useFile } from '@penx/hooks'
import { FileElement } from '../types'

export const FileView = (props: ElementProps<FileElement>) => {
  const { attributes, children, element } = props
  const editor = useSlateStatic()
  const selected = useSelected()
  const focused = useFocused()
  const active = selected && focused
  const { loading, file } = useFile(element.fileId)

  return (
    <Box
      {...attributes}
      contentEditable={false}
      textBase
      fontSemibold
      toCenterY
      gap2
      cursorPointer
      bgGray100={active}
      bgGray100--hover
      rounded
      px2
      py2
    >
      {loading && <Box>{children}</Box>}
      {!loading && (
        <>
          <Box gray400 inlineFlex>
            <Paperclip size={16} />
          </Box>
          <Box>
            {children}
            {file.name}
          </Box>
          <Box gray400 textXS fontNormal>
            {file.sizeFormatted}
          </Box>
        </>
      )}
    </Box>
  )
}
