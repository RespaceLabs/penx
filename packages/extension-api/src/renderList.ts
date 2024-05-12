import { EventType } from './constants'

type ListItem = {
  title: string
}
export function renderList(items: ListItem[]) {
  postMessage({
    type: EventType.RENDER_LIST,
    items,
  })
}
