import React from 'react'
import { Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

export interface SlateProps {
  [key: string]: unknown
  editor: ReactEditor
  value: Descendant[]
  children: React.ReactNode
  onChange: (value: SlateProps['value']) => void
}
