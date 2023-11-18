import { TElement } from './useEditor'

export function extractTags(element: any): string[] {
  if (!element.children) return []
  return element.children
    .filter((item: any) => item.type === 'tag')
    .map((i: any) => i.name.replace('#', ''))
}
