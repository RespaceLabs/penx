import { FocusEvent, KeyboardEvent, memo, useCallback, useMemo } from 'react'
import { isMobile } from 'react-device-detect'
import { css } from '@fower/react'
import { Editor } from 'slate'
import { Editable, RenderElementProps } from 'slate-react'
import { onKeyDownAutoformat } from '@penx/autoformat'
import { ELEMENT_TITLE } from '@penx/constants'
import { PenxEditor, useEditor, useEditorStatic } from '@penx/editor-common'
import { useOnCompositionEvent } from '@penx/editor-composition'
import { Leaf } from '@penx/editor-leaf'
import { extensionStore } from '@penx/extension-store'
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
        // 'data-slate-type': element.type,
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

    return (
      <Editable
        className={css('black outlineNone ' + editorAtomicStyle)}
        autoFocus={false}
        readOnly={readOnly}
        renderLeaf={(props) => <Leaf {...props} />}
        renderElement={renderElement}
        decorate={decorate as any} //
        onCompositionUpdate={onOnCompositionEvent}
        onCompositionEnd={onOnCompositionEvent}
        onKeyDown={keyDown}
        onDOMBeforeInput={onDOMBeforeInput}
        onBlur={blur}
      />
    )
  },
  (prev, next) => {
    return prev.onBlur === next.onBlur
  },
)
