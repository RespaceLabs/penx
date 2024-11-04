import { isMobile } from 'react-device-detect'
import { useEditor } from '@/lib/editor-common'
import { ElementProps } from '@/lib/extension-typings'
import { NodeType } from '@/lib/model'
import { cn } from '@/lib/utils'
import { useFocusTitle } from '../../hooks/useFocusTitle'
import { TitleElement } from '../../types'
import { CommonTitle } from './CommonTitle'
import { DailyTitle } from './DailyTitle'
import { TagMenu } from './TagMenu'

export const Title = (props: ElementProps<TitleElement>) => {
  const { element, attributes, children } = props
  const editor = useEditor()

  const disabled = [
    NodeType.INBOX,
    NodeType.DAILY,
    NodeType.DATABASE_ROOT,
  ].includes(element.nodeType as any)

  const isDaily = element.nodeType === NodeType.DAILY
  const isDatabase = element.nodeType === NodeType.DATABASE
  const isDailyRoot = element.nodeType === NodeType.DAILY_ROOT

  useFocusTitle(element)

  return (
    <div
      className={cn(
        'font-medium text-foreground/80 relative mb-4 flex items-center gap-2 pr-2',
        isDaily && isMobile ? 'hidden' : 'flex',
        editor.isOutliner && 'pl-5',
        isDatabase && 'pl-9',
        isDailyRoot && !editor.isOutliner && 'pl-4',
      )}
      {...attributes}
      // {...nodeProps}
    >
      {isDatabase && <TagMenu element={element} />}
      {!isDaily && <CommonTitle {...props} />}
      {isDaily && <DailyTitle {...props} />}
    </div>
  )
}
