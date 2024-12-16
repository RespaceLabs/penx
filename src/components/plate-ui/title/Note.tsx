import { useEffect } from 'react'
import { ITitleElement } from '@/components/editor/plugins/title-plugin'
import { useCompositionData } from '@/hooks'
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@/lib/constants'
import { ObjectType } from '@/lib/model'
import { cn } from '@/lib/utils'
import { PlateElementProps } from '@udecode/plate-common/react'
import { Node } from 'slate'
import { PlateElement } from '../plate-element'

export const Note = ({
  attributes,
  element,
  children,
}: PlateElementProps<ITitleElement>) => {
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
      // {...attributes}
      {...{ before: 'Write some note here...' }}
      className={cn(
        'leading-none  mt-4 w-full font-normal relative text-base z-10 before:content-[attr(before)] before:text-foreground/30 before:break-normal before:absolute before:bottom-0 before:top-0 before:cursor-text before:items-center before:text-base before:font-normal',
        isPlaceholderShow ? 'before:flex' : 'before:hidden',
      )}
    >
      {children}
    </div>
  )
}
