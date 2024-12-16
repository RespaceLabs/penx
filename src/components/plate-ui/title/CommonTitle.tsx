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

export const CommonTitle = ({
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
  const objectType = element.props?.objectType || ObjectType.ARTICLE

  return (
    <div
      // {...attributes}
      className={cn(
        "leading-none font-bold text-4xl w-full z-10 before:content-['Untitled'] before:text-foreground/20 before:break-normal before:absolute before:h-16 before:leading-loose before:top-0 before:cursor-text before:text-4xl before:font-bold",
        isPlaceholderShow ? 'before:block' : 'before:hidden',
        objectType === ObjectType.NOTE && 'hidden',
      )}
    >
      {children}
    </div>
  )
}
