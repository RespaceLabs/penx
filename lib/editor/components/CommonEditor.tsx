'use client'

import { Post } from '@plantreexyz/types'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

interface Props {
  value: any
  onChange: (value: any) => void
}

export function CommonEditor({ value, onChange }: Props) {
  const editor = withReact(createEditor())

  return (
    <Slate
      editor={editor}
      initialValue={value}
      onChange={(value) => {
        onChange(value)
      }}
      onValueChange={(value) => {
        console.log('onvalueChange>>>>>>>>:', value)
      }}
    >
      <Editable />
    </Slate>
  )
}
