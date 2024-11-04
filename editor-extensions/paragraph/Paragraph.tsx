import { useEditor, useEditorStatic } from '@/lib/editor-common'
import { findNodePath, getNodeByPath } from '@/lib/editor-queries'
import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { Node, Path } from 'slate'

export const Paragraph = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps) => {
  const editor = useEditorStatic()
  // const editor = useEditor()
  const path = findNodePath(editor, element)!
  const parent = Path.parent(path)
  const node: any = getNodeByPath(editor, parent)

  const isInTitle = node?.type === 'title'

  return (
    <div
      {...attributes}
      {...(nodeProps || {})}
      className={cn(
        'leading-normal relative py-[20px]',
        !isInTitle && 'text-lg',
        nodeProps?.className,
      )}
    >
      {children}
    </div>
  )
}
