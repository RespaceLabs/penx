import { FocusEvent, KeyboardEvent, memo, useCallback, useMemo } from 'react'
import { css } from '@fower/react'
import { Editor, Path, Transforms } from 'slate'
import { Editable, RenderElementProps } from 'slate-react'
import { onKeyDownAutoformat } from '@penx/autoformat'
import { ELEMENT_TITLE } from '@penx/constants'
import { PenxEditor, useEditor, useEditorStatic } from '@penx/editor-common'
import { useOnCompositionEvent } from '@penx/editor-composition'
import { Leaf } from '@penx/editor-leaf'
import { getNodeByPath } from '@penx/editor-queries'
import { extensionStore } from '@penx/extension-store'
import { isListElement, isListItemElement } from '@penx/list'
import { useDecorate } from '../hooks/useDecorate'
import { useOnDOMBeforeInput } from '../hooks/useOnDOMBeforeInput'
import { ElementContent } from './ElementContent'

interface Props {
  readOnly?: boolean
  editorAtomicStyle?: string
  onBlur?: (editor: PenxEditor) => void
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>, editor?: PenxEditor) => void
}

export const NodeEditorEditable = memo(
  function NodeEditorEditable({
    onBlur,
    editorAtomicStyle = '',
    onKeyDown,
    readOnly = false,
  }: Props) {
    // const editor = useEditor()
    const editor = useEditorStatic()
    const decorate = useDecorate(editor)
    const onDOMBeforeInput = useOnDOMBeforeInput(editor)
    const onOnCompositionEvent = useOnCompositionEvent(editor)

    const renderElement = useCallback((props: RenderElementProps) => {
      const attr = {
        ...props.attributes,
        'data-slate-type': (props.element as any).type,
      }

      return <ElementContent {...props} attributes={attr} />
    }, [])

    const keyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      // form auto format
      onKeyDownAutoformat(
        editor as any,
        {
          options: { rules: extensionStore.rules },
        } as any,
      )(e)

      onKeyDown?.(e, editor)

      for (const fn of editor.onKeyDownFns) {
        fn(editor, e)
      }
    }

    const blur = (e: FocusEvent<HTMLDivElement, globalThis.Element>) => {
      onBlur?.(editor)

      if (editor?.onBlurFns) {
        for (const fn of editor.onBlurFns) {
          fn(editor, e)
        }
      }
    }

    const select = (e: KeyboardEvent<HTMLDivElement>) => {
      if (editor?.onSelectFns) {
        for (const fn of editor.onSelectFns) {
          fn(editor, e)
        }
      }
    }

    return (
      <Editable
        className={css('black outlineNone ' + editorAtomicStyle)}
        autoFocus={false}
        readOnly={readOnly}
        // renderLeaf={(props) => <Leaf {...props} />}
        renderElement={renderElement}
        decorate={decorate as any} //
        onCompositionUpdate={onOnCompositionEvent}
        onCompositionEnd={onOnCompositionEvent}
        onKeyDown={keyDown}
        onSelect={select}
        // onSelect={() => {
        //   if (!editor.selection) return
        //   const { anchor, focus } = editor.selection
        //   const isEqual = Path.equals(anchor.path, focus.path)
        //   if (isEqual) return
        //   const entries = Editor.nodes(editor, {
        //     at: editor.selection,
        //     mode: 'lowest',
        //     match: (n: any) => {
        //       // return true
        //       // return isListItemElement(n.type)
        //       return Editor.isBlock(editor, n as any)
        //     },
        //   })
        //   const arr = Array.from(entries)
        //   for (const [, path] of arr) {
        //     // const node = getNodeByPath(editor, Path.parent(path))
        //     const node = getNodeByPath(editor, path.slice(0, path.length - 2))
        //     console.log('===========node:', node, 'path:', path)
        //   }
        // }}
        onDOMBeforeInput={onDOMBeforeInput}
        onBlur={blur}
      />
    )
  },
  (prev, next) => {
    return prev.onBlur === next.onBlur
  },
)
