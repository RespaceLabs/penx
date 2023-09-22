import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { Element } from 'slate'
import { withListsReact } from 'slate-lists'
import { Editable, Slate } from 'slate-react'
import { docPluginList } from '../docPluginList'
import { useCreateEditor } from '../hooks/useCreateEditor'
import { ElementContent } from './ElementContent'

interface Props {
  element: Element
}

export const DragOverlayContent = ({ element }: Props) => {
  const editor = withListsReact(useCreateEditor(docPluginList))
  const [value] = useState([JSON.parse(JSON.stringify(element))])

  useEffect(() => {
    document.body.classList.add('dragging')
    return () => document.body.classList.remove('dragging')
  }, [])

  return (
    <Box opacity-80>
      <Slate editor={editor} initialValue={value}>
        <Editable
          readOnly={true}
          renderElement={(p) => {
            return <ElementContent {...p} />
          }}
        />
      </Slate>
    </Box>
  )
}
