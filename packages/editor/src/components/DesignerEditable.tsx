import { useCallback } from 'react'
import { css } from '@fower/react'
import {
  Editable,
  RenderElementProps,
  useSlate,
  useSlateStatic,
} from 'slate-react'
import { findNodePath } from '@penx/editor-queries'
import { getAtomicProps } from '@penx/editor-shared/src/getAtomicProps'
import { useDecorate } from '../hooks/useDecorate'
import { useOnCompositionEvent } from '../hooks/useOnCompositionEvent'
import { useOnDOMBeforeInput } from '../hooks/useOnDOMBeforeInput'
import { useOnKeyDown } from '../hooks/useOnKeyDown'
import DesignerEditorElement from './DesignerEditorElement'
import { Leaf } from './Leaf'

export function DesignerEditable() {
  const editor = useSlateStatic()
  const onKeyDown = useOnKeyDown(editor)
  const decorate = useDecorate(editor)
  const onDOMBeforeInput = useOnDOMBeforeInput(editor)
  const onOnCompositionEvent = useOnCompositionEvent(editor)

  // const renderElement = useCallback(
  //   (p: RenderElementProps) => {
  //     const { element } = p
  //     const attr = {
  //       ...p.attributes,
  //       'data-slate-type': element.type,
  //     }

  //     return <EditorElement {...p} attributes={attr} />
  //   },
  //   [editor],
  // )
  const renderElement = useCallback(
    (p: RenderElementProps) => {
      const { element } = p
      const at = findNodePath(editor, element)
      const attr = {
        ...p.attributes,
        // 'data-slate-id': element.id,
        'data-slate-type': element.type,
        zIndex: element.selected ? 1 : 0,
        'ringBrand500-1': !!element.selected,
      } as any

      const atomicProps = getAtomicProps(element?.css)

      return (
        <DesignerEditorElement
          {...p}
          attributes={attr}
          atomicProps={atomicProps}
        />
      )
    },
    [editor],
  )

  return (
    <Editable
      className={css('black outlineNone')}
      renderLeaf={(props) => <Leaf {...props} />}
      renderElement={renderElement}
      // TODO: handle any
      decorate={decorate as any}
      onCompositionUpdate={onOnCompositionEvent}
      onCompositionEnd={onOnCompositionEvent}
      onKeyDown={onKeyDown}
      onDOMBeforeInput={onDOMBeforeInput}
    />
  )
}
