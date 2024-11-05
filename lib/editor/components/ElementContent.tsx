import { memo } from 'react'
import { isMobile } from 'react-device-detect'
import isEqual from 'react-fast-compare'
import { Paragraph } from '@/editor-extensions/paragraph'
import { extensionStore } from '@/lib/extension-store'
import { ElementProps } from '@/lib/extension-typings'
import { usePlaceholder } from '../hooks/usePlaceholder'

interface ElementContentProps extends ElementProps {
  children: React.ReactNode
}

export const ElementContent = memo(
  function ElementContent(props: ElementContentProps) {
    const { element, attributes } = props

    const { type } = element as any
    const { component: Element = Paragraph, placeholder } =
      extensionStore.elementMaps[type] || {}

    const { className, isShow, before } = usePlaceholder(element, placeholder)

    return (
      <Element
        {...props}
        attributes={attributes}
        nodeProps={{ className: isMobile ? '' : className, before }}
      />
    )
  },
  (prev, next) => {
    // TODO: need to improvement
    return isEqual(prev, next)
  },
)
