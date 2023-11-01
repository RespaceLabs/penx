import { FocusEvent, KeyboardEvent, useCallback } from 'react'
import { css } from '@fower/react'
import { Descendant, Editor } from 'slate'
import { Editable, RenderElementProps, Slate } from 'slate-react'
import { EditableProps } from 'slate-react/dist/components/editable'
import { onKeyDownAutoformat } from '@penx/autoformat'
import { SetNodeToDecorations } from '@penx/code-block'
import { Leaf } from '@penx/editor-leaf'
import { useExtensionStore } from '@penx/hooks'
import { useCreateEditor } from '../hooks/useCreateEditor'
import { useDecorate } from '../hooks/useDecorate'
import { useOnCompositionEvent } from '../hooks/useOnCompositionEvent'
import { useOnDOMBeforeInput } from '../hooks/useOnDOMBeforeInput'
import ClickablePadding from './ClickablePadding'
import { ElementContent } from './ElementContent'
import HoveringToolbar from './HoveringToolbar/HoveringToolbar'

interface Props {
  content: any[]
  editableProps?: EditableProps
  plugins: ((editor: Editor) => Editor)[]
  onChange?: (value: Descendant[], editor: Editor) => void
  onBlur?: (editor: Editor) => void
}

export function NodeEditor({ content, onChange, onBlur, plugins }: Props) {
  const editor = useCreateEditor(plugins)
  const { extensionStore } = useExtensionStore()
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

    for (const fn of editor.onKeyDownFns) {
      fn(editor, e)
    }
  }

  const blur = (e: FocusEvent<HTMLDivElement, globalThis.Element>) => {
    onBlur?.(editor)
    for (const fn of editor.onBlurFns) {
      fn(editor, e)
    }
  }

  return (
    <Slate
      editor={editor}
      initialValue={content}
      onChange={(value) => {
        onChange?.(value, editor)
      }}
    >
      <HoveringToolbar />

      <SetNodeToDecorations />

      <Editable
        className={css('black mt4 outlineNone')}
        renderLeaf={(props) => <Leaf {...props} />}
        renderElement={renderElement}
        decorate={decorate as any} //
        onCompositionUpdate={onOnCompositionEvent}
        onCompositionEnd={onOnCompositionEvent}
        onKeyDown={keyDown}
        onDOMBeforeInput={onDOMBeforeInput}
        onBlur={blur}
      />
      <ClickablePadding />
    </Slate>
  )
}
