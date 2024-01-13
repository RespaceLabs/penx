import { Box } from '@fower/react'
import { useEditor } from '@penx/editor-common'
import { ElementProps } from '@penx/extension-typings'
import { NodeType } from '@penx/model-types'
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
    <Box
      pl5={editor.isOutliner}
      pl9={isDatabase}
      pl4={isDailyRoot && !editor.isOutliner}
      text={[28, 28, 36]}
      fontMedium
      gray900
      relative
      mb4
      {...attributes}
      // {...nodeProps}
    >
      {isDatabase && <TagMenu element={element} />}
      {!isDaily && <CommonTitle {...props} />}
      {isDaily && <DailyTitle {...props} />}
    </Box>
  )
}
