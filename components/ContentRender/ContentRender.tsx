'use client'

import { createEditor } from 'slate'
import { Slate, withReact } from 'slate-react'
import { SlateContent } from './SlateContent'

interface Props {
  content: any
}

export function ContentRender({ content }: Props) {
  const editor = withReact(createEditor())

  return (
    <Slate
      editor={editor}
      initialValue={Array.isArray(content) ? content : JSON.parse(content)}
    >
      <SlateContent />
    </Slate>
  )
}
