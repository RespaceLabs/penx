import { EventType } from './constants'
import { ListItem } from './types'

export function renderList(items: ListItem[]) {
  postMessage({
    type: EventType.RenderList,
    items,
  })
}
