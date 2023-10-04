import { useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { Element } from 'slate'
import { Editable, Slate } from 'slate-react'
import { useCreateEditor } from '../hooks/useCreateEditor'
import { ElementContent } from './ElementContent'

interface Props {
  element: Element
}

export const DragOverlayContent = ({ element }: Props) => {
  const editor = useCreateEditor()
  const [value] = useState([JSON.parse(JSON.stringify(element))])

  useEffect(() => {
    document.body.classList.add('dragging')
    return () => document.body.classList.remove('dragging')
  }, [])

  return (
    <Box opacity-80>
      <Slate editor={editor as any} initialValue={value}>
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
