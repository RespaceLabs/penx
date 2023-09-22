import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { CheckListItem } from './CheckListItem'
import { withCheckList } from './withCheckList'

export default function checkList(): EditorPlugin {
  return {
    with: withCheckList,
    elements: [
      {
        name: 'Check List',
        type: ElementType.check_list_item,
        component: CheckListItem,
      },
    ],
  }
}
