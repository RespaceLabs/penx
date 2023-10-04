import { memo } from 'react'
import isEqual from 'react-fast-compare'
import { useSlateStatic } from 'slate-react'
import { usePluginStore } from '@penx/hooks'
import { Paragraph } from '@penx/paragraph'
import { ElementProps } from '@penx/plugin-typings'
import { usePlaceholder } from '../hooks/usePlaceholder'

interface ElementContentProps extends ElementProps {
  children: React.ReactNode
}

export const ElementContent = memo(
  function ElementContent(props: ElementContentProps) {
    const { element, attributes } = props
    const { pluginStore } = usePluginStore()
    const { type } = element as any
    const { component: Element = Paragraph, placeholder } =
      pluginStore.elementMaps[type] || {}

    const className = usePlaceholder(element, placeholder)

    return (
      <Element {...props} attributes={attributes} nodeProps={{ className }} />
    )
  },
  (prev, next) => {
    return isEqual(prev.element, next.element)
  },
)
