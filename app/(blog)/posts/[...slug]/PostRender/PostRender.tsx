'use client'

import { Post } from '@plantreexyz/types'
import { createEditor } from 'slate'
import { Slate, withReact } from 'slate-react'
import { SlateContent } from './SlateContent'

interface Props {
  post: Post
}

export function PostRender({ post }: Props) {
  const editor = withReact(createEditor())

  return (
    <Slate editor={editor} initialValue={post.content}>
      <SlateContent />
    </Slate>
  )
}
