'use client'

import { useSpace } from '@/app/(creator-fi)/hooks/useSpace'
import Editor from '../components/editor/advanced-editor'

export default function Page() {
  const { space } = useSpace()

  return (
    <Editor
      className="break-all p-3"
      initialValue={space.aboutJson}
      editable={false}
      onChange={(v) => {}}
    />
  )
}
