import { EventType } from './constants'

export function renderMarkdown(text: string) {
  postMessage({
    type: EventType.RenderMarkdown,
    content: text,
  })
}
