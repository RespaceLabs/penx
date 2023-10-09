import { memo } from 'react'
import { isMobile } from 'react-device-detect'
import isEqual from 'react-fast-compare'
import { flip, offset, shift, useFloating } from '@floating-ui/react'
import { Box } from '@fower/react'
import { mergeRefs } from 'bone-ui'
import { useSlateStatic } from 'slate-react'
import { Button } from 'uikit'
import { selectEditor } from '@penx/editor-transforms'
import { ElementProps } from '@penx/extension-typings'
import { isHeading } from '@penx/heading'
import { useExtensionStore } from '@penx/hooks'
import { isParagraph, Paragraph } from '@penx/paragraph'
import { usePlaceholder } from '../hooks/usePlaceholder'

interface ElementContentProps extends ElementProps {
  children: React.ReactNode
}

export const ElementContent = memo(
  function ElementContent(props: ElementContentProps) {
    const editor = useSlateStatic()
    const { element, attributes } = props
    const { extensionStore } = useExtensionStore()
    const { type } = element as any
    const { component: Element = Paragraph, placeholder } =
      extensionStore.elementMaps[type] || {}

    const { className, isShow } = usePlaceholder(element, placeholder)

    const { refs, floatingStyles } = useFloating({
      placement: 'right',
      middleware: [
        offset(0),
        flip({ fallbackAxisSideDirection: 'end' }),
        shift(),
      ],
    })

    attributes.ref = mergeRefs([attributes.ref, refs.reference])

    return (
      <>
        {isShow && (
          <Box
            contentEditable={false}
            ref={refs.setFloating}
            h={isHeading(element) ? '2em' : 'calc(1.5em + 8px)'}
            text3XL={isHeading(element, 'h1')}
            text2XL={isHeading(element, 'h2')}
            textXL={isHeading(element, 'h3')}
            textLG={isHeading(element, 'h4')}
            textSM={isHeading(element, 'h6')}
            toCenterY
            gap1
            style={{
              ...floatingStyles,
              left: 'unset',
              right: 0,
              zIndex: 1,
            }}
          >
            {isHeading(element) && (
              <Box gray300 fontSemibold>
                {placeholder}
              </Box>
            )}

            {isParagraph(element) && <Box gray300>Text</Box>}

            <Button
              size="sm"
              isSquare
              colorScheme="white"
              onClick={() => {
                editor.insertText('/')
                selectEditor(editor, { focus: true })
              }}
            >
              /
            </Button>
          </Box>
        )}
        <Element
          {...props}
          attributes={attributes}
          nodeProps={{ className: isMobile ? '' : className }}
        />
      </>
    )
  },
  (prev, next) => {
    return isEqual(prev.element, next.element)
  },
)
