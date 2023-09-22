import { useSlate, useSlateStatic } from 'slate-react'
import { ElementProps } from '@penx/editor-types'
import { useClickElement } from '../hooks/useClickElement'
import { usePlaceholder } from '../hooks/usePlaceholder'
import { Paragraph } from '../plugins/paragraph/Paragraph'

function DesignerEditorElement(props: ElementProps) {
  const editor = useSlateStatic()
  const { element, attributes } = props
  const { type } = element
  const { component: Element = Paragraph, placeholder } =
    editor.elementMaps[type] || {}
  const className = usePlaceholder(element, placeholder)

  const click = useClickElement(element)

  return (
    <Element
      {...props}
      attributes={{
        ...attributes,
        onClick: click,
      }}
      nodeProps={{ className }}
    />
  )
}

export default DesignerEditorElement
