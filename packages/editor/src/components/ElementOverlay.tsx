import { useCallback } from 'react'
import { Box, css } from '@fower/react'
import { Element } from 'slate'
import { Editable, RenderElementProps, Slate } from 'slate-react'
import { docPluginList } from '../docPluginList'
import { useCreateEditor } from '../hooks/useCreateEditor'
import { Leaf } from './Leaf'
import { UnsortableElement } from './UnsortableElement'

interface Props {
  activeId: string
  elements: Element[]
}

export function ElementOverlay({ activeId, elements }: Props) {
  const element = elements.find((c) => c.id === activeId)!

  // const editor = useCreateEditor(docPluginList)
  // const renderElement = useCallback((p: RenderElementProps) => {
  //   return <UnsortableElement {...p} />
  // }, [])

  return (
    <Box shadow roundedLG p4 inlineFlex bgWhite>
      Move to
    </Box>
  )

  // return (
  //   <Slate editor={editor} initialValue={[element]} onChange={() => {}}>
  //     <Editable
  //       readOnly
  //       className={css(
  //         'black',
  //         'bgWhite',
  //         'roundedSmall',
  //         'shadow',
  //         'px0',
  //         'py0',
  //         'zIndex-100',
  //         'relative',
  //       )}
  //       renderLeaf={(props) => <Leaf {...props} />}
  //       renderElement={renderElement}
  //     />
  //   </Slate>
  // )
}
