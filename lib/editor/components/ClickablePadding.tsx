import { memo } from 'react'
import { useEditor } from '@/lib/editor-common'


const ClickablePadding = () => {
  const editor = useEditor()

  return (
    <div
      className="clickable-padding min-h-[200px] cursor-text"
      onClick={(e) => {
        //
      }}
    />
  )
}

export default memo(ClickablePadding)
