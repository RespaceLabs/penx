import {
  buildStyles,
  CircularProgressbarWithChildren,
} from 'react-circular-progressbar'
import { Box } from '@fower/react'
import { Editor } from 'slate'
import { CheckListItemElement, isCheckListItem } from '@penx/check-list'
import { useEditor } from '@penx/editor-common'

export const TaskProgress = () => {
  const editor = useEditor()

  const entries = Editor.nodes(editor, {
    at: [],
    match: isCheckListItem,
  })

  let sum = 0
  let checkedSum = 0
  for (const item of Array.from(entries)) {
    const node = item[0] as CheckListItemElement
    sum++
    if (node.checked) checkedSum++
  }

  const percentage = (checkedSum / sum) * 100

  if (!sum) return null

  return (
    <Box contentEditable={false} w-60 flexShrink-0>
      <CircularProgressbarWithChildren
        value={percentage}
        styles={buildStyles({
          pathColor: `rgba(0, 0, 0, 0.8)`,
        })}
        strokeWidth={10}
      >
        <Box gray500 toCenter textBase fontNormal>
          {checkedSum}/{sum}
        </Box>
      </CircularProgressbarWithChildren>
    </Box>
  )
}
