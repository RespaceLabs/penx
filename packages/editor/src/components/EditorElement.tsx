import { memo } from 'react'
import isEqual from 'react-fast-compare'
import { useSlate, useSlateStatic } from 'slate-react'
import { ElementProps } from '@penx/extension-typings'
import { Paragraph } from '@penx/paragraph'
import { usePlaceholder } from '../hooks/usePlaceholder'

function EditorElement(props: ElementProps) {
  const editor = useSlateStatic()
  const { element } = props
  const { type } = element

  const { component: Element = Paragraph, placeholder } =
    editor.elementMaps[type] || {}

  const className = usePlaceholder(element, placeholder)

  return <Element {...props} nodeProps={{ className }} />
}

export default memo(EditorElement, (prev, next) => {
  return isEqual(prev.element, next.element)
})
