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
import { cn } from '@/lib/utils'
import { Node } from 'slate'
import { useFocusTitle } from '../../hooks/useFocusTitle'
import { TitleElement } from '../../types'

export const CommonTitle = ({
  attributes,
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
      {...attributes}
      className={cn(
        "leading-none before:content-['Untitled'] before:text-foreground/20 before:break-normal before:absolute before:h-16 before:leading-loose before:top-0 before:cursor-text w-full before:text-4xl before:font-bold",
        isPlaceholderShow ? 'before:block' : 'before:hidden',
      )}
    >
      {children}
    </div>
  )
}
