import { flip, offset, shift, useFloating } from '@floating-ui/react'
import { Box } from '@fower/react'
import { Element } from 'slate'
import { Button } from 'uikit'
import { useEditor, useEditorStatic } from '@penx/editor-common'
import { selectEditor } from '@penx/editor-transforms'
import { isHeading } from '@penx/heading'

interface SlashTriggerProps {
  element: Element
}

export const SlashTrigger = ({ element }: SlashTriggerProps) => {
  const editor = useEditorStatic()
  const { refs, floatingStyles } = useFloating({
    placement: 'right',
    middleware: [
      offset(0),
      flip({ fallbackAxisSideDirection: 'end' }),
      shift(),
    ],
  })

  return (
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
  )
}
