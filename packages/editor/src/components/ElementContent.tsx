import { memo } from 'react'
import { isMobile } from 'react-device-detect'
import isEqual from 'react-fast-compare'
import { ElementProps } from '@penx/extension-typings'
import { useExtensionStore } from '@penx/hooks'
import { Paragraph } from '@penx/paragraph'
import { usePlaceholder } from '../hooks/usePlaceholder'
import { SlashTrigger } from './SlashTrigger'

interface ElementContentProps extends ElementProps {
  children: React.ReactNode
}

export const ElementContent = memo(
  function ElementContent(props: ElementContentProps) {
    const { element, attributes } = props

    const { extensionStore } = useExtensionStore()
    const { type } = element as any
    const { component: Element = Paragraph, placeholder } =
      extensionStore.elementMaps[type] || {}

    const { className, isShow } = usePlaceholder(element, placeholder)

    return (
      <>
        {/* {isShow && <SlashTrigger element={element} />} */}
        <Element
          {...props}
          attributes={attributes}
          nodeProps={{ className: isMobile ? '' : className }}
        />
      </>
    )
  },
  (prev, next) => {
    // TODO: need to improvement
    return isEqual(prev, next)
  },
)
