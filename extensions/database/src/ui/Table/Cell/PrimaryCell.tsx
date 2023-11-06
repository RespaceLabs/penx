import React, {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Box, css } from '@fower/react'
import { createEditor, Editor, Node } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'
import { useDebouncedCallback } from 'use-debounce'
import { PenxEditor, TElement, useEditor } from '@penx/editor-common'
import { Leaf } from '@penx/editor-leaf'
import { Paragraph } from '@penx/paragraph'
import { Tag } from '@penx/tag'
import { CellProps } from './CellProps'

function withCell(editor: Editor) {
  const { isInline, isVoid } = editor

  editor.isInline = (element: any) => {
    return ['tag'].includes(element.type) ? true : isInline(element)
  }

  editor.isVoid = (element: any) => {
    return ['tag'].includes(element.type) ? true : isVoid(element)
  }

  return editor
}

export const PrimaryCell: FC<CellProps> = memo(function TextCell(props) {
  const { cell, updateCell, selected, width, index, element } = props
  const [value, setValue] = useState(cell.props.data || '')

  const [editor] = useState(() =>
    withCell(withReact(withHistory(createEditor()))),
  )

  const debouncedUpdate = useDebouncedCallback(async (value: any) => {
    updateCell(value)
  }, 500)

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const data = e.target.value
    setValue(data)
    debouncedUpdate(data)
  }

  const renderElement = useCallback((props: RenderElementProps) => {
    const element = props.element as TElement
    if (element.type === 'p') {
      return <Paragraph {...props} />
    }

    if (element.type === 'tag') {
      return <Tag {...(props as any)} />
    }

    return <div {...props}>{props.children}</div>
  }, [])

  if (typeof element === 'string') return null

  return (
    <Box w-100p h-100p relative inlineFlex>
      <Slate
        editor={editor as any}
        initialValue={[element]}
        onChange={(value) => {}}
      >
        {/* <HoveringToolbar /> */}
        <Editable
          className={css('black outlineNone h-100p w-100p')}
          renderLeaf={(props) => <Leaf {...props} />}
          renderElement={renderElement}
        />
      </Slate>
    </Box>
  )
})
