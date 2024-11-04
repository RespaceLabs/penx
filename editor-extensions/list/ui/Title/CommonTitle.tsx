import { useEffect } from 'react'
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@/lib/constants'
import { useEditor, useEditorStatic } from '@/lib/editor-common'
import { useCompositionData } from '@/lib/editor-composition'
import { ElementProps } from '@/lib/extension-typings'
import { Node } from 'slate'
import { TitleElement } from '../../types'

export const CommonTitle = ({
  element,
  children,
}: ElementProps<TitleElement>) => {
  const titleStr = Node.string(element)

  const isHeading = [
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
  ].includes((element.children as any)?.[0]?.type || '')

  const { compositionData } = useCompositionData(element.id)
  const isPlaceholderShow = !titleStr?.length && !compositionData && !isHeading

  return (
    <div
      className="leading-none"
      // css={{
      //   '::before': {
      //     content: `"Untitled"`,
      //     gray200: true,
      //     breakNormal: true,
      //     display: isPlaceholderShow ? 'block' : 'none',
      //     absolute: true,
      //     h: '1.5em',
      //     leading: '1.5em',
      //     top: 0,
      //     // top: '50%',
      //     // transform: 'translate(0, -50%)',
      //     whiteSpace: 'nowrap',
      //     cursorText: true,
      //   },
      // }}
    >
      {children}
    </div>
  )
}
